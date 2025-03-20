import React, { useState, useEffect } from "react";
import API from "../Services/api";
import "../Styles/Task.css";
export default function Tasks() {
  const [error, setError] = useState("");
  const [data, setData] = useState([]);
  const [file, setFile] = useState(null);
  const [assigned, setAssigned] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden"; // disable scrolling on this page

    return () => {
      document.body.style.overflow = "auto"; // enable scrolling when leaving
    };
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const allowedExtensions = ["csv", "xlsx", "xls"];
      const fileExtension = file.name.split(".").pop().toLowerCase();

      if (!allowedExtensions.includes(fileExtension)) {
        setError("Invalid file type. Please upload an Excel file.");
        event.target.value = "";
      } else {
        setError("");
        console.log("File is valid:", file.name);
        setFile(file);
      }
    }
  }; //validates file format

  const getTasks = async () => {
    if (!file) {
      setError("Please select a file");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await API.post("/tasks/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setData(res.data.tasks);
    } catch (error) {
      console.error("Error uploading file", error);
    }
  }; //extracts record from uploaded file

  const assignTasks = async () => {
    try {
      const res = await API.post("/tasks/assign", data, {
        header: {
          "Content-Type": "application/json",
        },
      });
      setAssigned(true);
    } catch (err) {
      setError("failed to assign tasks.Check file");
      setData([]);
      console.log(err.message);
    }
  }; //saves and assigns the extracted tasks

  useEffect(() => {
    if (assigned) {
      const timer = setTimeout(() => {
        window.location.reload();
        setAssigned(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [assigned]);

  return (
    <div className="taskFetch">
      <section className="actions">
        <input
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={handleFileChange}
        />

        <button onClick={getTasks}>Get Tasks</button>
      </section>

      {/* displays if some error occurs in fetching details from file */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* displays all the tasks fetched from the file */}
      {!assigned && data && data.length > 0 && (
        <div className="assign">
          <div className="table-container">
            <table className="fetchTask-table">
              <thead>
                <tr>
                  {Object.keys(data[0]).map((key) => (
                    <td key={key}>{key}</td>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, index) => (
                  <tr key={index}>
                    {Object.values(row).map((val, i) => (
                      <td key={i}>{val}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button onClick={assignTasks}>Assign tasks</button>
        </div>
      )}
      {/* displayed upon succesful saving of tasks and assignation */}
      {assigned && <div>Succesfully assigned tasks</div>}
    </div>
  );
}
