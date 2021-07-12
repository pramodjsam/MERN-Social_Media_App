const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UserInputError } = require("apollo-server");
const User = require("../../models/User");
const { SECRET_KEY } = require("../../config");
const {
  validateRegisterUser,
  validateLoginUser,
} = require("../../utils/validators");

const generateToken = async (user) => {
  const token = await jwt.sign(
    {
      id: user._id,
      email: user.email,
      username: user.username,
    },
    SECRET_KEY,
    { expiresIn: "1h" }
  );
  return token;
};

module.exports = {
  Mutation: {
    async login(_, { username, password }) {
      const { valid, errors } = validateLoginUser(username, password);
      if (!valid) {
        throw new UserInputError("Error", {
          errors: errors,
        });
      }
      const user = await User.findOne({ username: username });
      if (!user) {
        errors.general = "User not found";
        throw new UserInputError("Errors", {
          errors: errors,
        });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        errors.general = "Wrong Credentails";
        throw new UserInputError("Errors", {
          errors: errors,
        });
      }
      const token = await generateToken(user);
      return {
        ...user._doc,
        id: user._id,
        token,
      };
    },
    async register(
      parent,
      { registerInput: { username, password, confirmPassword, email } },
      context,
      info
    ) {
      // Validate User data
      const { valid, errors } = validateRegisterUser(
        username,
        password,
        confirmPassword,
        email
      );
      if (!valid) {
        throw new UserInputError("Error", {
          errors: errors,
        });
      }
      // Make sure user doesn't already exists
      const user = await User.findOne({ username: username });
      if (user) {
        throw new UserInputError("Username already taken", {
          errors: {
            username: "This username is already taken",
          },
        });
      }
      //hash password and create an auth token
      password = await bcrypt.hash(password, 12);
      const newUser = new User({
        email,
        username,
        password,
        createdAt: new Date().toISOString(),
      });
      const res = await newUser.save();
      const token = await generateToken(res);
      return {
        ...res._doc,
        id: res._id,
        token: token,
      };
    },
  },
};
