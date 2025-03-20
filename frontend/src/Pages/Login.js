import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../Services/api";
import "../Styles/login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await API.post(
        "/login/login",
        { email, password },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const { data } = response;
      console.log(data);
      if (!data.token) {
        throw new Error(data.msg || "Login failed");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("id",data.id)


      //redirects to admin dashboard if role==admin in database or agent dashboard if rol==agent
      if (data.role === "admin") {
        navigate("/admin");
      } else if (data.role === "agent") {
        navigate("/agent");
      }
    } catch (err) {
      setError(
        err.response?.data?.msg || err.message || "Something went wrong"
      );
    }
  };

  useEffect(() => {
    document.body.style.overflow = "hidden"; // Enable scrolling on this page

    return () => {
      document.body.style.overflow = "auto"; // Disable scrolling when leaving
    };
  }, []);
  return (
    <div className="Login">
      <h2>Login</h2>
      {error && <p>{error}</p>} {/* displays if credentials are wrong */}
      
      <form onSubmit={handleLogin} className="form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
