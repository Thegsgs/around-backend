const express = require("express");

const usersRouter = require("./routes/users");
const cardsRouter = require("./routes/cards");

const { PORT = 3000 } = process.env;

const app = express();
app.use("/", usersRouter, cardsRouter);

app.listen(PORT);
