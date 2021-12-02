const Card = require("../models/card");

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
  const error = new Error("No card with that id");
  error.statusCode = 404;
  throw error;
};

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => handleResponse(res, cards))
    .catch((err) => handleError(err, res));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => handleResponse(res, card))
    .catch((err) => handleError(err, res));
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.id)
    .orFail(orFailSettings)
    .then((card) => handleResponse(res, card))
    .catch((err) => handleError(err, res));
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail(orFailSettings)
    .then((card) => handleResponse(res, card))
    .catch((err) => handleError(err, res));
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.id,
    {
      $pull: { likes: req.user._id },
    },
    { new: true }
  )
    .orFail(orFailSettings)
    .then((card) => handleResponse(res, card))
    .catch((err) => handleError(err, res));
};

module.exports = { getCards, createCard, deleteCard, likeCard, dislikeCard };
