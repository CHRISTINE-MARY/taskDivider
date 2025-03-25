const mongoose = require("mongoose");

//structure of user collection
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  Phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
  admin_id:{type:mongoose.Schema.Types.ObjectId,ref:"User"}
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
