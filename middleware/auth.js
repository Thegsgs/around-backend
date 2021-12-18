const jwt = require("jsonwebtoken");
const UnauthorizedError = require("../errors/unauthorized-err");

const handleAuthError = () => {
  throw new UnauthorizedError("Authorization Error");
};

const extractToken = (header) => header.replace("Bearer ", "");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return handleAuthError();
  }

  const token = extractToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, "super-strong-secret");
  } catch (err) {
    return handleAuthError();
  }
  req.user = payload;
  return next();
};
