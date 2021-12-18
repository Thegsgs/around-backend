const router = require("express").Router();
const validator = require("validator");
const { celebrate, Joi } = require("celebrate");
const auth = require("../middleware/auth");
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateUserAvatar,
  loginUser,
  getUserData,
} = require("../controllers/users");

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

router.post(
  "/signup",
  celebrate({
    body: Joi.object()
      .keys({
        email: Joi.string().required().email(),
        password: Joi.string().required(),
      })
      .unknown(true),
  }),
  createUser
);

router.post(
  "/signin",
  celebrate({
    body: Joi.object()
      .keys({
        email: Joi.string().required().email(),
        password: Joi.string().required(),
      })
      .unknown(true),
  }),
  loginUser
);

router.use(auth);

router.get("/users", getUsers);

router.get("/users/me", getUserData);

router.get(
  "/users/:id",
  celebrate({
    params: Joi.object()
      .keys({
        id: Joi.string().alphanum().length(24),
      })
      .unknown(true),
  }),
  getUserById
);

router.patch(
  "/users/me",
  celebrate({
    body: Joi.object()
      .keys({
        name: Joi.string().required().min(2).max(30),
        about: Joi.string().required().min(2).max(30),
      })
      .unknown(true),
  }),
  updateUser
);

router.patch(
  "/users/me/avatar",
  celebrate({
    body: Joi.object()
      .keys({
        avatar: Joi.string().required().custom(validateURL),
      })
      .unknown(true),
  }),
  updateUserAvatar
);

module.exports = router;
