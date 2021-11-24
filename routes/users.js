const router = require("express").Router();
const fsPromises = require("fs").promises;
const path = require("path");

const USERS_PATH = path.join(__dirname, "../data/users.json");

router.get("/users", (req, res) => {
  fsPromises
    .readFile(USERS_PATH, { encoding: "utf-8" })
    .then((users) => {
      res.send(JSON.parse(users));
    })
    .catch(() => res.status(500).send({ message: "An error has occurred" }));
});

router.get("/users/:id", (req, res) => {
  fsPromises
    .readFile(USERS_PATH, { encoding: "utf-8" })
    .then((users) => {
      const parsedUserdata = JSON.parse(users);
      const user = parsedUserdata.find((usr) => usr._id === req.params.id);
      if (!user) {
        res.status(404).send({ message: "User ID not found" });
      } else {
        res.send({ data: user });
      }
    })
    .catch(() => res.status(500).send({ message: "An error has occurred" }));
});

module.exports = router;
