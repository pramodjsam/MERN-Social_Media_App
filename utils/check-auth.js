const jwt = require("jsonwebtoken");
const { AuthenticationError } = require("apollo-server");
const { SECRET_KEY } = require("../config");

module.exports = async (context) => {
  const authHeader = context.req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    if (token) {
      try {
        const user = await jwt.verify(token, SECRET_KEY);
        if (user) {
          return user;
        }
      } catch (err) {
        throw new AuthenticationError("Invalid/Expired token");
      }
    }
    throw new Error("Authentication token required");
  }
  throw new Error("Unauthorized route");
};
