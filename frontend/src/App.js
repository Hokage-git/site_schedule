import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Schedule from "./Schedule";
import AdminPanel from "./AdminPanel";
import "./App.css";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState(null);

  return (
    <Router>
      <div className="container">
        <Routes>
          <Route
            path="/login"
            element={
              !isLoggedIn ? (
                <Login
                  setIsLoggedIn={setIsLoggedIn}
                  setIsAdmin={setIsAdmin}
                  setUser={setUser}
                />
              ) : (
                <Navigate to="/schedule" />
              )
            }
          />
          <Route
            path="/register"
            element={!isLoggedIn ? <Register /> : <Navigate to="/schedule" />}
          />
          <Route
            path="/schedule"
            element={
              isLoggedIn ? (
                <Schedule
                  isAdmin={isAdmin}
                  setIsLoggedIn={setIsLoggedIn}
                  user={user}
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/admin"
            element={
              isLoggedIn && isAdmin ? (
                <AdminPanel />
              ) : (
                <Navigate to="/schedule" />
              )
            }
          />
          <Route path="/" element={<Navigate to="/schedule" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
