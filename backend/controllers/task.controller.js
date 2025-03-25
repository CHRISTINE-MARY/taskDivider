const express = require("express");
const xlsx = require("xlsx");
const mongoose = require("mongoose");
const Task = require("../models/Task.model");
const User = require("../models/User.model");

//to extract tasks from file uploaded
const getTasks = async (req, res) => {
  console.log("Headers received:", req.headers);

  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  try {
    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheet = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheet]);

    for (const item of data) {
      if (!item.FirstName || !item.Phone || !item.Notes) {
        return res
          .status(400)
          .json({ error: "Missing required fields in some records" });
      }
    }
    return res.json({ tasks: data });
  } catch (error) {
    console.error("Error printing tasks:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

//to assign tasks to the agents available
const assignTasks = async (req, res) => {
  const {data,admin_id} = req.body;
  console.log("Headers received:", req.headers);
  try {
    const AgentIDs = await User.find({ role: "agent" ,admin_id:admin_id}).select("_id");
    if (AgentIDs.length === 0) {
      return res.status(400).json({ error: "No agents found to assign tasks" });
    }
    let count = 0;
    for (const item of data) {
      if (!item.FirstName || !item.Phone || !item.Notes) {
        console.log("Skipping invalid task:", item);
        continue;
      }
      item.assigned = AgentIDs[count % AgentIDs.length]._id;

      count += 1;
    }

    const savedTasks = await Task.insertMany(data);
    const userTaskUpdates = savedTasks.map((task) => ({
      userId: task.assigned,
      taskId: task._id,
    }));

    for (const { userId, taskId } of userTaskUpdates) {
      await User.findByIdAndUpdate(userId, { $push: { tasks: taskId } });
    }

    return res
      .status(201)
      .json({ success: true, message: "Succesfully saved" });
  } catch (error) {
    console.error("Error assigning tasks:", error); // Log the exact error
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getTasks, assignTasks };
