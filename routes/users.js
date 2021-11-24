const router = require("express").Router();
const fsPromises = require("fs").promises;
const path = require("path");

const USERS_PATH = path.join(__dirname, "../data/users.json");

router.get("/", (req, res) => {
  res.status(404).send({ message: "Requested resource not found" });
});

router.get("/users", (req, res) => {
  fsPromises.readFile(USERS_PATH, { encoding: "utf-8" }).then((users) => {
    res.send(users);
  });
});

router.get("/users/:_id", (req, res) => {
  fsPromises
    .readFile(USERS_PATH, { encoding: "utf-8" })
    .then((users) => {
      const parsedUserdata = JSON.parse(users);
      const user = parsedUserdata.find((usr) => usr.id === req.params.id);
      if (!users) {
        res.status(404).send({ message: "User ID not found" });
      } else {
        res.send({ data: user });
      }
    })
    .catch(() => res.status(500).send({ message: "An error has occurred" }));
});

module.exports = router;
