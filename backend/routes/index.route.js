const express = require("express");
const router = express.Router();
const login = require("./login.route");
const agent = require("./agent.route");
const task = require("./task.route");

router.use("/login", login);
router.use("/agent", agent);
router.use("/tasks", task);
module.exports = router;
