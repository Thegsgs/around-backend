const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const usersRouter = require("./routes/users");
const cardsRouter = require("./routes/cards");

const { PORT = 3000 } = process.env;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect("mongodb://localhost:27017/arounddb");

app.use((req, res, next) => {
  req.user = {
    _id: "61a7a8fe548e05fb82b054ee",
  };

  next();
});

app.use("/", usersRouter, cardsRouter);
app.get("*", (req, res) => {
  res.status(404).send({ message: "Requested resource not found" });
});
app.listen(PORT);
