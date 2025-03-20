const User = require("../models/User.model");
const Task = require("../models/Task.model");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");

//ro retrieve details of all agents added and their tasks assigned
const listAgents = async (req, res) => {
  try {
    const agents = await User.find({ role: "agent" })
      .select("-password")
      .populate("tasks");
    res.status(200).json({ success: true, data: agents });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

//to fetch tasks assigned to the agent using agent id
const fetchAgentData = async (req, res) => {
  try {
    const { id } = req.body;
    const response = await User.findOne({ _id: id })
      .populate("tasks")
      .select("tasks");

    res.status(200).json({ data: response });
  } catch (error) {
    console.error("Error fetching agent details:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

//to add new agent
const registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { name, email, password, Phone, role } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }
    user = new User({
      name,
      email,
      password,
      Phone,
      role,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    const data = await user.save();

    res.status(201).json({
      data: data,
      success: true,
      message: "Agent registered successfully",
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

module.exports = { listAgents, registerUser, fetchAgentData };
