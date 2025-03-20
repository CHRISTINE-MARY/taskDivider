const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const { getTasks, assignTasks } = require("../controllers/task.controller");

router.post("/upload", upload.single("file"), getTasks);
router.post("/assign", assignTasks);

module.exports = router;
