const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv").config();

const middlewares = require("./middlewares");
const logs = require("./api/logs");

const app = express();

app.enable("trust proxy"); // needed for rate limiting by Client IP

// ***When pushing to heroku, ensure mongodb link replace .env.databseurl***
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(morgan("common"));
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "It's Alive.",
  });
});

app.use("/api/logs", logs);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

app.listen(process.env.PORT || 1337, () => {
  console.log(`It's Alive`);
});
