import React, { useEffect, useState } from "react";
import API from "../Services/api";
import { useNavigate } from "react-router-dom";
import "../Styles/Admin.css";

export default function Admin() {
  const navigate = useNavigate();
  const [agents, loadAgents] = useState([]);
  const [isoverflow, setOverflow] = useState(false);
  const [agentForm, setForm] = useState(false);
  const [expandedAgent, setExpandedAgent] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    countryCode: "+1", // Default country code (USA)
    role: "agent",
  });

  //country code for phone
  const countryCodes = [
    { code: "+1", country: "USA" },
    { code: "+91", country: "India" },
    { code: "+44", country: "UK" },
    { code: "+61", country: "Australia" },
    { code: "+81", country: "Japan" },
  ];

  const addAgents = async () => {
    if (agents.length >= 5) {
      setOverflow(true);
    } else {
      setForm(true);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }; //updates form variables of agent details

  const handleCountryCodeChange = (e) => {
    setFormData({ ...formData, countryCode: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullPhoneNumber = `${formData.countryCode} ${formData.phone}`;

    try {
      const response = await API.post(
        "/agent/register",
        { ...formData, Phone: fullPhoneNumber }, // Send combined phone number
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 201) {
        setForm(false);
        fetchAgents();
      } else {
        console.error("Unexpected response", response);
      }
    } catch (err) {
      console.error("Error adding agent:", err.message);
    }
  }; //handles form submit for agent addition

  const fetchAgents = async () => {
    try {
      const response = await API.get("/agent/listAgents");
      loadAgents(response.data.data);
    } catch (err) {
      console.log(err.message);
    }
  }; //fetches all the existing agents 

  const toggleDropdown = (agentId) => {
    setExpandedAgent(expandedAgent === agentId ? null : agentId);
  }; //implements toggle for tasks dropdown

  useEffect(() => {
    fetchAgents();
  }, []);

  return (
    <>
      <section className="buttons">
        <button onClick={addAgents} className="agentAdd">
          +Add agent
        </button>
        <button onClick={() => navigate("./addTasks")}>Add Tasks</button>
      </section>
      {/* displays only when add agent is clicked*/}
      {agentForm && (
        <div className="overlay">
          <div className="form-container">
            <button onClick={() => setForm(false)} className="close-btn">
              X
            </button>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Name"
                name="name"
                onChange={handleChange}
                required
              />
              <input
                type="text"
                placeholder="Email"
                name="email"
                onChange={handleChange}
                required
              />
              <input
                type="password"
                placeholder="Password"
                minLength="8"
                name="password"
                onChange={handleChange}
                required
              />
              <div className="phone-input">
                <select
                  value={formData.countryCode}
                  onChange={handleCountryCodeChange}
                >
                  {countryCodes.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.code}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Phone"
                  name="phone"
                  onChange={handleChange}
                  required
                />
              </div>
              <input type="submit" value="Add Agent" />
            </form>
          </div>
        </div>
      )}
      {/* displays only when no of agents exceeds 5 */}
      {isoverflow && (
        <div className="overflow">
          <p>No more agents allowed</p>
          <button onClick={() => setOverflow(false)}>X</button>
        </div>
      )}

      {/* displays details of agents along with tasks assigned */}
      <div className="agents">
        {agents.length > 0 ? (
          agents.map((agent) => (
            <section className="agentDetails" key={agent._id}>
              <div className="self">
                <i
                  className={`bx ${
                    expandedAgent === agent._id
                      ? "bxs-caret-up-circle"
                      : "bxs-caret-down-circle"
                  }`}
                  onClick={() => toggleDropdown(agent._id)}
                ></i>
                <span>{agent.name}</span>
                <span>{agent.email}</span>
                <span>{agent.Phone}</span>
              </div>
              {expandedAgent === agent._id && (
                <div className="tasks">
                  {agent.tasks.length > 0 ? (
                    <table className="task-table">
                      <tbody>
                        {agent.tasks.map((task, key) => (
                          <tr key={key}>
                            <td>{task.Notes}</td>
                            <td>{task.FirstName}</td>
                            <td>{task.Phone}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p>No tasks assigned</p>
                  )}
                </div>
              )}
            </section>
          ))
        ) : (
          <p>You don't have any agents</p>
        )}
      </div>
    </>
  );
}
