const mongoose = require("mongoose");

//Structure of task collection
const TaskSchema = new mongoose.Schema({
  FirstName: { type: String, required: true },
  Phone: { type: Number, required: true },
  Notes: { type: String, required: true },
  assigned: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const Task = mongoose.model("Task", TaskSchema);

module.exports = Task;
