const cors = require("cors");
const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const validator = require("validator");
const auth = require("../middleware/auth");
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require("../controllers/cards");

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

router.use(auth);

router.get("/cards", cors(), getCards);

router.post(
  "/cards",
  celebrate({
    body: Joi.object()
      .keys({
        name: Joi.string().required().min(2).max(30),
        link: Joi.string().required().custom(validateURL),
      })
      .unknown(true),
  }),
  createCard
);

router.delete(
  "/cards/:id",
  celebrate({
    params: Joi.object()
      .keys({
        id: Joi.string().alphanum().length(24),
      })
      .unknown(true),
  }),
  deleteCard
);

router.put(
  "/cards/:id/likes",
  celebrate({
    params: Joi.object()
      .keys({
        id: Joi.string().alphanum().length(24),
      })
      .unknown(true),
  }),
  likeCard
);

router.delete(
  "/cards/:id/likes",
  celebrate({
    params: Joi.object()
      .keys({
        id: Joi.string().alphanum().length(24),
      })
      .unknown(true),
  }),
  dislikeCard
);

module.exports = router;
