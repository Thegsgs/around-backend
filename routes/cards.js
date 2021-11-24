const router = require("express").Router();
const fsPromises = require("fs").promises;
const path = require("path");

const CARDS_PATH = path.join(__dirname, "../data/cards.json");

router.get("/cards", (req, res) => {
  fsPromises.readFile(CARDS_PATH, { encoding: "utf-8" }).then((cards) => {
    res.send(cards);
  });
});

module.exports = router;
