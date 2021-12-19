const Card = require("../models/card");
const NotFoundError = require("../errors/not-found-err");
const ForbiddenError = require("../errors/forbidden-err");

const handleResponse = (res, dataObj) =>
  res
    .setHeader(
      "Access-Control-Allow-Origin",
      "https://simonshrb.students.nomoreparties.site"
    )
    .send({ data: dataObj });

const orFailSettings = () => {
  throw new NotFoundError("No card with this id.");
};

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => handleResponse(res, cards))
    .catch((err) => next(err));
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => handleResponse(res, card))
    .catch((err) => next(err));
};

const deleteCard = (req, res, next) => {
  Card.findById(req.params.id)
    .orFail(orFailSettings)
    .then((card) => {
      if (!card.owner._id.equals(req.user._id)) {
        throw new ForbiddenError("Access forbidden!");
      }
      return Card.findByIdAndDelete(req.params.id).then(() =>
        handleResponse(res, card)
      );
    })
    .catch((err) => next(err));
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail(orFailSettings)
    .then((card) => handleResponse(res, card))
    .catch((err) => next(err));
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.id,
    {
      $pull: { likes: req.user._id },
    },
    { new: true }
  )
    .orFail(orFailSettings)
    .then((card) => handleResponse(res, card))
    .catch((err) => next(err));
};

module.exports = { getCards, createCard, deleteCard, likeCard, dislikeCard };
