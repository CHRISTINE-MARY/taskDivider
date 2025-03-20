import React, { useEffect, useState } from "react";
import API from "../Services/api";
import "../Styles/Agent.css";

export default function Agent() {
  const [tasks, addTasks] = useState([]);
  const fetchAgentData = async () => {
    const id = localStorage.getItem("id");
    console.log(id);
    if (!id) {
      console.error("No id found");
      return;
    }

    try {
      const response = await API.post(
        "/agent/fetchAgent",
        { id },
        { headers: { "Content-Type": "application/json" } }
      );
      console.log(response);
      addTasks(response.data.data.tasks);
    } catch (error) {
      console.error("Error fetching agent data:", error);
    }
  };
  useEffect(() => {
    fetchAgentData();
  }, []); 

  return (
    <div className="container">
      <h1>Your Tasks</h1>
      <section className="agentTasks">
        {/* displays all the assigned tasks */}
        {tasks.length > 0 ? (
          <div className="agentTask">
            {tasks.map((task, index) => (
              <div key={index} className="details">
                <span>{index + 1}</span>
                <span>{task.FirstName}</span>
                <span>{task.Notes}</span>
                <span>{task.Phone}</span>
              </div>
            ))}
          </div>
        ) : (
          <div>No tasks assigned</div>
        )}
      </section>
    </div>
  );
}
