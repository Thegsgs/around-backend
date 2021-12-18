const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const UnauthorizedError = require("../errors/unauthorized-err");

const userSchema = new mongoose.Schema({
  name: {
    default: "Jacques Cousteau",
    minlength: 2,
    maxlength: 30,
    type: String,
  },
  about: {
    default: "Explorer",
    minlength: 2,
    maxlength: 30,
    type: String,
  },
  avatar: {
    default: "https://pictures.s3.yandex.net/resources/avatar_1604080799.jpg",
    type: String,
    validate: {
      validator: (value) => validator.isURL(value),
    },
  },
  email: {
    required: true,
    unique: true,
    type: String,
    validate: {
      validator: (value) => validator.isEmail(value),
    },
  },
  password: {
    required: true,
    type: String,
    select: false,
  },
});

userSchema.statics.findByCredentials = function findByCredentials({
  email,
  password,
}) {
  return this.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        return Promise.reject(new UnauthorizedError("Incorrect email"));
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new UnauthorizedError("Incorrect password."));
        }
        return user;
      });
    });
};

module.exports = mongoose.model("user", userSchema);
