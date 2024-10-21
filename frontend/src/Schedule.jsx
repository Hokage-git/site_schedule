import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Schedule = ({ isAdmin, setIsLoggedIn, user }) => {
  const [schedule, setSchedule] = useState({});
  const [allWeeks, setAllWeeks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeWeek, setActiveWeek] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchSchedule();
      fetchWeeks();
    }
  }, [user]);

  const fetchSchedule = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/schedule/${user.groupId}`
      );
      setSchedule(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Ошибка при загрузке расписания:", error);
      setError("Ошибка при загрузке расписания");
      setLoading(false);
    }
  };

  const fetchWeeks = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/weeks");
      setAllWeeks(response.data.map((week) => week.week_number.toString()));
      setActiveWeek(response.data[0]?.week_number.toString() || null);
    } catch (error) {
      console.error("Ошибка при загрузке недель:", error);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate("/login");
  };

  const handleAdminPanel = () => {
    navigate("/admin");
  };

  if (loading) {
    return <div className="loading">Загрузка расписания...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

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
    <div className="schedule-container">
      <h1>Расписание занятий</h1>
      <div className="user-info">
        <p>ФИО: {user.fullName}</p>
        <p>Факультет: {user.facultyName}</p>
        <p>Группа: {user.groupCode}</p>
      </div>
      <div className="week-tabs">
        {allWeeks.map((weekNumber) => (
          <button
            key={weekNumber}
            className={activeWeek === weekNumber ? "active" : ""}
            onClick={() => setActiveWeek(weekNumber)}
          >
            Неделя {weekNumber}
          </button>
        ))}
      </div>
      {activeWeek && (
        <div className="week-schedule">
          <h2>Неделя {activeWeek}</h2>
          {daysOfWeek.map((day) => (
            <div key={day} className="day-schedule">
              <h3>{day}</h3>
              {schedule[activeWeek] &&
              schedule[activeWeek][day] &&
              schedule[activeWeek][day].length > 0 ? (
                <table>
                  <thead>
                    <tr>
                      <th>Предмет</th>
                      <th>Преподаватель</th>
                      <th>Время начала</th>
                      <th>Время окончания</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schedule[activeWeek][day].map((classItem, index) => (
                      <tr key={index}>
                        <td>{classItem.subject}</td>
                        <td>{classItem.teacher}</td>
                        <td>{classItem.start_time}</td>
                        <td>{classItem.end_time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="no-classes">Пар нет</p>
              )}
            </div>
          ))}
        </div>
      )}
      <div className="actions">
        {isAdmin && (
          <button onClick={handleAdminPanel}>Панель администратора</button>
        )}
        <button onClick={handleLogout}>Выйти</button>
      </div>
    </div>
  );
};

export default Schedule;
