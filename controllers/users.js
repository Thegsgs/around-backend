const User = require("../models/user");

const handleResponse = (res, dataObj) => {
  res.send({ data: dataObj });
};

const handleError = (err, res) => {
  if (err.name === "CastError") {
    res.status(400).send({ message: "Invalid object" });
  } else if (err.statusCode === 404) {
    res.status(404).send({ message: err.message });
  } else {
    res.status(500).send({ message: err.message || "Internal Server error" });
  }
};

const orFailSettings = () => {
  const error = new Error("No user with that id");
  error.statusCode = 404;
  throw error;
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => handleResponse(res, users))
    .catch((err) => handleError(err, res));
};

const getUserById = (req, res) => {
  User.findById(req.params.id)
    .orFail(orFailSettings)
    .then((user) => handleResponse(res, user))
    .catch((err) => handleError(err, res));
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => handleResponse(res, user))
    .catch((err) => handleError(err, res));
};

const updateUser = (req, res) => {
  const { name: newName, about: newAbout } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    {
      name: newName,
      about: newAbout,
    },
    { new: true, runValidators: true, upsert: false }
  )
    .orFail(orFailSettings)
    .then((user) => handleResponse(res, user))
    .catch((err) => handleError(err, res));
};

const updateUserAvatar = (req, res) => {
  const { avatar: newAvatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar: newAvatar },
    { new: true, runValidators: true, upsert: false }
  )
    .orFail(orFailSettings)
    .then((user) => handleResponse(res, user))
    .catch((err) => handleError(err, res));
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateUserAvatar,
};
