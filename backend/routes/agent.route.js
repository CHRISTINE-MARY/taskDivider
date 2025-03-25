const express = require("express");
const router = express.Router();
const {
  listAgents,
  registerUser,
  fetchAgentData,
} = require("../controllers/agent.controller");
const { check } = require("express-validator");

router.post(
  "/register",
  [
    check("email", "PLease enter a valid email").isEmail(),
    check("password", "Password must be atleast 6 characters").isLength({
      min: 6,
    }),
  ],
  registerUser
); //validates email and password

router.post("/listAgents", listAgents);
router.post("/fetchAgent", fetchAgentData);

module.exports = router;
