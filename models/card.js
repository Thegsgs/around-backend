const mongoose = require("mongoose");

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
      validator: (val) => /https?:\/\/\S+/.test(val),
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("card", cardSchema);
