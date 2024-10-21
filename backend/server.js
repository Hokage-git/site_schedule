const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// Настройки подключения к базе данных PostgreSQL
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "schedule_site",
  password: "123",
  port: 5432,
});

// Регистрация
app.post("/api/register", async (req, res) => {
  const { email, groupId, fullName, password } = req.body;
  try {
    const userExists = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    if (userExists.rows.length > 0) {
      return res
        .status(400)
        .json({ message: "Пользователь с таким email уже существует" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      "INSERT INTO users (email, group_id, full_name, password, is_admin) VALUES ($1, $2, $3, $4, $5)",
      [email, groupId, fullName, hashedPassword, false]
    );
    res.status(201).json({ message: "Регистрация успешна" });
  } catch (error) {
    console.error("Ошибка при регистрации:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// Вход
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query(
      "SELECT u.*, g.group_code, f.faculty_name FROM users u JOIN groups g ON u.group_id = g.group_id JOIN faculties f ON g.faculty_id = f.faculty_id WHERE u.email = $1",
      [email]
    );
    if (result.rows.length === 1) {
      const user = result.rows[0];
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (isValidPassword) {
        res.json({
          message: "Вход выполнен успешно",
          user: {
            id: user.user_id,
            email: user.email,
            fullName: user.full_name,
            groupId: user.group_id,
            groupCode: user.group_code,
            facultyName: user.faculty_name,
            isAdmin: user.is_admin,
          },
        });
      } else {
        res.status(401).json({ message: "Неверный email или пароль" });
      }
    } else {
      res.status(401).json({ message: "Неверный email или пароль" });
    }
  } catch (error) {
    console.error("Ошибка при входе:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// Получение списка групп
app.get("/api/groups", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM groups");
    res.json(result.rows);
  } catch (error) {
    console.error("Ошибка при получении списка групп:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// Получение всего расписания для админ-панели
app.get("/api/schedule/all", async (req, res) => {
  try {
    console.log("Получен запрос на /api/schedule/all");

    const result = await pool.query(`
      SELECT s.schedule_id, w.week_number, d.day_name, c.subject, c.teacher, s.start_time, s.end_time, g.group_code
      FROM schedule s
      JOIN weeks w ON s.week_id = w.week_id
      JOIN days_of_week d ON s.day_id = d.day_id
      JOIN classes c ON s.class_id = c.class_id
      JOIN groups g ON c.group_id = g.group_id
      ORDER BY w.week_number, d.day_id, s.start_time
    `);

    console.log("Результат запроса:", result.rows);
    res.json(result.rows);
  } catch (error) {
    console.error("Ошибка при получении расписания:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// Получение расписания для конкретной группы
app.get("/api/schedule/:groupId", async (req, res) => {
  const { groupId } = req.params;
  try {
    console.log("Получен запрос на /api/schedule");

    // Получаем все недели
    const weeksResult = await pool.query(
      "SELECT week_number FROM weeks ORDER BY week_number"
    );

    // Получаем расписание
    const scheduleResult = await pool.query(
      `
      SELECT w.week_number, d.day_name, c.subject, c.teacher, s.start_time, s.end_time
      FROM schedule s
      JOIN weeks w ON s.week_id = w.week_id
      JOIN days_of_week d ON s.day_id = d.day_id
      JOIN classes c ON s.class_id = c.class_id
      WHERE c.group_id = $1
      ORDER BY w.week_number, d.day_id, s.start_time
    `,
      [groupId]
    );

    // Создаем объект с пустыми неделями
    const schedule = weeksResult.rows.reduce((acc, week) => {
      acc[week.week_number] = {};
      return acc;
    }, {});

    // Заполняем расписание
    scheduleResult.rows.forEach((item) => {
      if (!schedule[item.week_number]) {
        schedule[item.week_number] = {};
      }
      if (!schedule[item.week_number][item.day_name]) {
        schedule[item.week_number][item.day_name] = [];
      }
      schedule[item.week_number][item.day_name].push(item);
    });

    console.log("Результат запроса:", schedule);
    res.json(schedule);
  } catch (error) {
    console.error("Ошибка при получении расписания:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// Добавление занятия
app.post("/api/schedule", async (req, res) => {
  const { weekNumber, dayName, subject, teacher, startTime, endTime, groupId } =
    req.body;
  try {
    // Начинаем транзакцию
    await pool.query("BEGIN");

    // Проверяем существование недели, если нет - создаем
    let weekResult = await pool.query(
      "SELECT week_id FROM weeks WHERE week_number = $1",
      [weekNumber]
    );
    let weekId;
    if (weekResult.rows.length === 0) {
      const newWeekResult = await pool.query(
        "INSERT INTO weeks (week_number, start_date, end_date) VALUES ($1, CURRENT_DATE, CURRENT_DATE + 6) RETURNING week_id",
        [weekNumber]
      );
      weekId = newWeekResult.rows[0].week_id;
    } else {
      weekId = weekResult.rows[0].week_id;
    }

    // Получаем id дня недели
    const dayResult = await pool.query(
      "SELECT day_id FROM days_of_week WHERE day_name = $1",
      [dayName]
    );
    if (dayResult.rows.length === 0) {
      throw new Error("Неверное название дня недели");
    }
    const dayId = dayResult.rows[0].day_id;

    // Проверяем существование занятия, если нет - создаем
    let classResult = await pool.query(
      "SELECT class_id FROM classes WHERE subject = $1 AND teacher = $2 AND group_id = $3",
      [subject, teacher, groupId]
    );
    let classId;
    if (classResult.rows.length === 0) {
      const newClassResult = await pool.query(
        "INSERT INTO classes (subject, teacher, group_id) VALUES ($1, $2, $3) RETURNING class_id",
        [subject, teacher, groupId]
      );
      classId = newClassResult.rows[0].class_id;
    } else {
      classId = classResult.rows[0].class_id;
    }

    // Добавляем занятие в расписание
    const scheduleResult = await pool.query(
      "INSERT INTO schedule (week_id, day_id, class_id, start_time, end_time) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [weekId, dayId, classId, startTime, endTime]
    );

    // Завершаем транзакцию
    await pool.query("COMMIT");

    res.status(201).json(scheduleResult.rows[0]);
  } catch (error) {
    await pool.query("ROLLBACK");
    console.error("Ошибка при добавлении занятия:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// Получение списка недель
app.get("/api/weeks", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM weeks ORDER BY week_number");
    res.json(result.rows);
  } catch (error) {
    console.error("Ошибка при получении списка недель:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// Создание новой недели
app.post("/api/weeks", async (req, res) => {
  const { week_number } = req.body;
  try {
    const existingWeek = await pool.query(
      "SELECT * FROM weeks WHERE week_number = $1",
      [week_number]
    );
    if (existingWeek.rows.length > 0) {
      return res
        .status(400)
        .json({ message: "Неделя с таким номером уже существует" });
    }
    const result = await pool.query(
      "INSERT INTO weeks (week_number, start_date, end_date) VALUES ($1, CURRENT_DATE, CURRENT_DATE + 6) RETURNING *",
      [week_number]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Ошибка при создании недели:", error);
    res.status(500).json({ message: "Ошибка сервера при создании недели" });
  }
});

// Удаление занятия
app.delete("/api/schedule/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM schedule WHERE schedule_id = $1", [id]);
    res.json({ message: "Занятие успешно удалено" });
  } catch (error) {
    console.error("Ошибка при удалении занятия:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// Создание нового факультета
app.post("/api/faculties", async (req, res) => {
  const { facultyName } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO faculties (faculty_name) VALUES ($1) RETURNING *",
      [facultyName]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Ошибка при создании факультета:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// Создание новой группы
app.post("/api/groups", async (req, res) => {
  const { groupCode, facultyId } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO groups (group_code, faculty_id) VALUES ($1, $2) RETURNING *",
      [groupCode, facultyId]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Ошибка при создании группы:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// Получение списка факультетов
app.get("/api/faculties", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM faculties");
    res.json(result.rows);
  } catch (error) {
    console.error("Ошибка при получении списка факультетов:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});
