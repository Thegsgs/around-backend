const mongoose = require("mongoose");
const validator = require("validator");

const cardSchema = new mongoose.Schema({
  name: {
    required: true,
    minlength: 2,
    maxlength: 30,
    type: String,
  },
  link: {
    required: true,
    type: String,
    validate: {
      validator: (value) => validator.isURL(value),
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("card", cardSchema);
