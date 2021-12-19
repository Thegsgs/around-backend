require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const { errors } = require("celebrate");
const usersRouter = require("./routes/users");
const cardsRouter = require("./routes/cards");
const { requestLogger, errorLogger } = require("./middleware/logger");

const { PORT = 3000 } = process.env;
const app = express();
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.options("*", cors());
mongoose.connect("mongodb://localhost:27017/arounddb");
app.use(requestLogger);

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

app.use("/", usersRouter, cardsRouter);

app.use(errorLogger);
app.use(errors());
app.use((err, req, res, next) => {
  if (err.name === "CastError") {
    res.status(400).send({ message: "Invalid object" });
  } else {
    const { statusCode = 500, message } = err;
    res.status(statusCode).send({
      message: statusCode === 500 ? "An error occurred on the server" : message,
    });
  }
});

app.get("*", (req, res) => {
  res.status(404).send({ message: "Requested resource not found" });
});
app.listen(PORT);
