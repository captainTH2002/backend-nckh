const jwt = require("jsonwebtoken");
const { secretKeyJWT } = require("../config");
const { secretKeyRFT } = require("../config");
//ma hoa 2 chieu

const generateToken = (user, expiresIn) => {
  const token = jwt.sign({ user }, secretKeyJWT, {
    expiresIn: expiresIn,
  });
  return token;
};

const generateRFToken = (user, expiresIn) => {
  const token = jwt.sign({ user }, secretKeyRFT, {
    expiresIn: expiresIn,
  });
  return token;
};

const verifyToken = (token) => {
  const data = jwt.verify(token, secretKeyJWT);
  return data;
};

const verifyRFToken = (token) => {
  const data = jwt.verify(token, secretKeyRFT);
  return data;
};

module.exports = {
  generateToken,
  generateRFToken,
  verifyToken,
  verifyRFToken,
};
