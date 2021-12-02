const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    required: true,
    minlength: 2,
    maxlength: 30,
    type: String,
  },
  about: {
    required: true,
    minlength: 2,
    maxlength: 30,
    type: String,
  },
  avatar: {
    required: true,
    type: String,
    validate: {
      validator: (val) => /https?:\/\/\S+/.test(val),
    },
  },
});

module.exports = mongoose.model("user", userSchema);