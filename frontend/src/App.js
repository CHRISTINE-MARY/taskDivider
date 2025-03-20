import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Pages/Login";
import Admin from "./Pages/Admin";
import Agent from "./Pages/Agent";
import Tasks from "./Pages/Tasks";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} /> {/* Login page */}
        <Route path="/agent" element={<Agent />} /> {/* Agent dashboard */}
        <Route path="/admin" element={<Admin />} /> {/* Admin dashboard */}
        <Route path="/admin/addTasks" element={<Tasks />} /> {/* admin task assignation page */}
      </Routes>
    </Router>
  );
}

export default App;
