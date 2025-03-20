const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

const mongoURI = process.env.MONGO_URI;
const indexroute = require("./routes/index.route");

app.use("/api", indexroute);

mongoose
  .connect(mongoURI)
  .then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    process.exit(1);
  });
