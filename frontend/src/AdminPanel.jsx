import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminPanel = () => {
  const [weekNumber, setWeekNumber] = useState("");
  const [dayName, setDayName] = useState("");
  const [subject, setSubject] = useState("");
  const [teacher, setTeacher] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [groupId, setGroupId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [schedule, setSchedule] = useState([]);
  const [weeks, setWeeks] = useState([]);
  const [groups, setGroups] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [newFacultyName, setNewFacultyName] = useState("");
  const [newGroupCode, setNewGroupCode] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchSchedule();
    fetchWeeks();
    fetchGroups();
    fetchFaculties();
  }, []);

  const fetchFaculties = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/faculties");
      setFaculties(response.data);
    } catch (error) {
      console.error("Ошибка при получении списка факультетов:", error);
    }
  };

  const fetchSchedule = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/schedule/all"
      );
      console.log("Fetched schedule:", response.data);
      setSchedule(response.data);
    } catch (error) {
      console.error("Error fetching schedule:", error);
      setError("Ошибка при загрузке расписания");
    }
  };

  const fetchWeeks = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/weeks");
      console.log("Fetched weeks:", response.data);
      setWeeks(response.data);
    } catch (error) {
      console.error("Error fetching weeks:", error);
      setError("Ошибка при загрузке списка недель");
    }
  };

  const fetchGroups = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/groups");
      console.log("Fetched groups:", response.data);
      setGroups(response.data);
    } catch (error) {
      console.error("Error fetching groups:", error);
      setError("Ошибка при загрузке списка групп");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      await axios.post("http://localhost:3000/api/schedule", {
        weekNumber,
        dayName,
        subject,
        teacher,
        startTime,
        endTime,
        groupId,
      });

      setMessage("Занятие успешно добавлено");
      clearForm();
      fetchSchedule();
    } catch (error) {
      console.error("Error adding class:", error);
      setError("Ошибка при добавлении занятия");
    }
  };

  const handleDeleteClass = async (scheduleId) => {
    try {
      await axios.delete(`http://localhost:3000/api/schedule/${scheduleId}`);
      setMessage("Занятие успешно удалено");
      fetchSchedule();
    } catch (error) {
      console.error("Error deleting class:", error);
      setError("Ошибка при удалении занятия");
    }
  };

  const handleCreateWeek = async () => {
    try {
      const newWeekNumber = Math.max(...weeks.map((w) => w.week_number), 0) + 1;
      await axios.post("http://localhost:3000/api/weeks", {
        week_number: newWeekNumber,
      });
      setMessage("Неделя успешно создана");
      fetchWeeks();
    } catch (error) {
      console.error("Error creating week:", error);
      setError("Ошибка при создании недели");
    }
  };

  const handleCreateFaculty = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/api/faculties", {
        facultyName: newFacultyName,
      });
      setNewFacultyName("");
      fetchFaculties();
    } catch (error) {
      console.error("Ошибка при создании факультета:", error);
    }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/api/groups", {
        groupCode: newGroupCode,
        facultyId: selectedFaculty,
      });
      setNewGroupCode("");
      setSelectedFaculty("");
      fetchGroups();
    } catch (error) {
      console.error("Ошибка при создании группы:", error);
    }
  };

  const clearForm = () => {
    setWeekNumber("");
    setDayName("");
    setSubject("");
    setTeacher("");
    setStartTime("");
    setEndTime("");
    setGroupId("");
  };

  const handleBackToSchedule = () => {
    navigate("/schedule");
  };

  const daysOfWeek = [
    "Понедельник",
    "Вторник",
    "Среда",
    "Четверг",
    "Пятница",
    "Суббота",
    "Воскресенье",
  ];

  return (
    <div className="admin-panel">
      <h2>Панель администратора</h2>
      <form onSubmit={handleSubmit}>
        <select
          value={weekNumber}
          onChange={(e) => setWeekNumber(e.target.value)}
          required
        >
          <option value="">Выберите номер недели</option>
          {weeks.map((week) => (
            <option key={week.week_id} value={week.week_number}>
              Неделя {week.week_number}
            </option>
          ))}
        </select>
        <select
          value={dayName}
          onChange={(e) => setDayName(e.target.value)}
          required
        >
          <option value="">Выберите день недели</option>
          {daysOfWeek.map((day) => (
            <option key={day} value={day}>
              {day}
            </option>
          ))}
        </select>
        <select
          value={groupId}
          onChange={(e) => setGroupId(e.target.value)}
          required
        >
          <option value="">Выберите группу</option>
          {groups.map((group) => (
            <option key={group.group_id} value={group.group_id}>
              {group.group_code}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Предмет"
          required
        />
        <input
          type="text"
          value={teacher}
          onChange={(e) => setTeacher(e.target.value)}
          placeholder="Преподаватель"
          required
        />
        <input
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          placeholder="Время начала"
          required
        />
        <input
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          placeholder="Время окончания"
          required
        />
        <button type="submit">Добавить занятие</button>
      </form>
      <button onClick={handleCreateWeek}>Создать новую неделю</button>
      {message && <p className="message success">{message}</p>}
      {error && <p className="message error">{error}</p>}

      <h3>Текущее расписание</h3>
      <table>
        <thead>
          <tr>
            <th>Неделя</th>
            <th>День</th>
            <th>Группа</th>
            <th>Предмет</th>
            <th>Преподаватель</th>
            <th>Начало</th>
            <th>Конец</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {schedule.map((item) => (
            <tr key={item.schedule_id}>
              <td>{item.week_number}</td>
              <td>{item.day_name}</td>
              <td>{item.group_code}</td>
              <td>{item.subject}</td>
              <td>{item.teacher}</td>
              <td>{item.start_time}</td>
              <td>{item.end_time}</td>
              <td>
                <button onClick={() => handleDeleteClass(item.schedule_id)}>
                  Удалить
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Создание нового факультета</h3>
      <form onSubmit={handleCreateFaculty}>
        <input
          type="text"
          value={newFacultyName}
          onChange={(e) => setNewFacultyName(e.target.value)}
          placeholder="Название факультета"
          required
        />
        <button type="submit">Создать факультет</button>
      </form>

      <h3>Создание новой группы</h3>
      <form onSubmit={handleCreateGroup}>
        <select
          value={selectedFaculty}
          onChange={(e) => setSelectedFaculty(e.target.value)}
          required
        >
          <option value="">Выберите факультет</option>
          {faculties.map((faculty) => (
            <option key={faculty.faculty_id} value={faculty.faculty_id}>
              {faculty.faculty_name}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={newGroupCode}
          onChange={(e) => setNewGroupCode(e.target.value)}
          placeholder="Код группы"
          required
        />
        <button type="submit">Создать группу</button>
      </form>
      <button onClick={handleBackToSchedule} style={{ marginTop: "20px" }}>
        Вернуться к расписанию
      </button>
    </div>
  );
};

export default AdminPanel;
