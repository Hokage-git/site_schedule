import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState("");
  const [groupId, setGroupId] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/groups");
      setGroups(response.data);
    } catch (err) {
      console.error("Ошибка при получении списка групп:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await axios.post("http://localhost:3000/api/register", {
        email,
        groupId,
        fullName,
        password,
      });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Ошибка при регистрации");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Регистрация</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
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
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="ФИО"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Пароль"
            required
          />
          <button type="submit">Зарегистрироваться</button>
        </form>
        {error && <p className="error">{error}</p>}
        <p>
          Уже есть аккаунт? <Link to="/login">Войти</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
