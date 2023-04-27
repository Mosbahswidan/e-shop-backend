const jwt = require("jsonwebtoken");

const createToken = async(payload) => {
  await jwt.sign({ userId: payload }, process.env.JWT_SECRET_KEY, {
    expiresIn: "90d",
  });
};

module.exports = createToken;
