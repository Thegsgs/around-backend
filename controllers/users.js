const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const { NODE_ENV, JWT_SECRET } = process.env;
const NotFoundError = require("../errors/not-found-err");
const ForbiddenError = require("../errors/forbidden-err");
const ConflictError = require("../errors/conflict-err");

const handleResponse = (res, dataObj) => res.send({ data: dataObj });

const orFailSettings = () => {
  throw new NotFoundError("No user with that id.");
};

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => handleResponse(res, users))
    .catch((err) => next(err));
};

const getUserById = (req, res, next) => {
  User.findById(req.params.id)
    .orFail(orFailSettings)
    .then((user) => handleResponse(res, user))
    .catch((err) => next(err));
};

const createUser = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return bcrypt
          .hash(password, 10)
          .then((hash) =>
            User.create({ name, about, avatar, email, password: hash })
          )
          .then((createdUser) =>
            handleResponse(res, {
              _id: createdUser._id,
              name: createdUser.name,
              about: createdUser.about,
              avatar: createdUser.avatar,
              email: createdUser.email,
            })
          )
          .catch((err) => next(err));
      }
      throw new ConflictError("User already exists!");
    })
    .catch((err) => next(err));
};

const updateUser = (req, res, next) => {
  const { name: newName, about: newAbout } = req.body;

  User.findById(req.user._id)
    .orFail(orFailSettings)
    .then((user) => {
      if (!user._id.equals(req.user._id)) {
        throw new ForbiddenError("Access forbidden!");
      }
      return User.findByIdAndUpdate(
        req.user._id,
        {
          name: newName,
          about: newAbout,
        },
        { new: true, runValidators: true, upsert: false }
      );
    })
    .then((updatedUser) => handleResponse(res, updatedUser))
    .catch((err) => next(err));
};

const updateUserAvatar = (req, res, next) => {
  const { avatar: newAvatar } = req.body;
  User.findById(req.user._id)
    .orFail(orFailSettings)
    .then((user) => {
      if (!user._id.equals(req.user._id)) {
        throw new ForbiddenError("Access forbidden!");
      }
      return User.findByIdAndUpdate(
        req.user._id,
        { avatar: newAvatar },
        { new: true, runValidators: true, upsert: false }
      );
    })
    .then((updatedUser) => handleResponse(res, updatedUser))
    .catch((err) => next(err));
};

const loginUser = (req, res, next) => {
  const { email, password } = req.body;
  User.findByCredentials({ email, password })
    .then((user) => {
      res.send({
        token: jwt.sign(
          { _id: user._id },
          NODE_ENV === "production" ? JWT_SECRET : "dev-secret",
          {
            expiresIn: "7d",
          }
        ),
      });
    })
    .catch((err) => next(err));
};

const getUserData = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(orFailSettings)
    .then((user) => handleResponse(res, user))
    .catch((err) => next(err));
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateUserAvatar,
  loginUser,
  getUserData,
};
