import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Login = ({ setIsLoggedIn, setIsAdmin, setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.post("http://localhost:3000/api/login", {
        email,
        password,
      });
      setIsLoggedIn(true);
      setIsAdmin(response.data.user.isAdmin);
      setUser(response.data.user);
      navigate("/schedule");
    } catch (err) {
      setError(err.response?.data?.message || "Ошибка при входе");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Вход</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Пароль"
            required
          />
          <button type="submit">Войти</button>
        </form>
        {error && <p className="error">{error}</p>}
        <p>
          Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
