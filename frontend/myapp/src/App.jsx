import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Auth/Login";
import Registration from "./pages/Auth/Registration";
import Home from "./pages/Home/Home";

export default function App() {
  const token = localStorage.getItem("token");

  return (
    <div>
      <Router>
        <Routes>
          {token ? (
            <>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Navigate to="/" />} />
              <Route path="/registration" element={<Navigate to="/" />} />
            </>
          ) : (
            <>
              <Route path="/login" element={<Login />} />
              <Route path="/registration" element={<Registration />} />
            </>
          )}
          <Route path="*" element={<Navigate to={token ? "/" : "/login"} />} />
        </Routes>
      </Router>
    </div>
  );
}
