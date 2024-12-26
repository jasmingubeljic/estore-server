const { query, validationResult } = require("express-validator");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports.login = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ messages: [errors.errors[0].msg] });
  }

  const { email, password } = req.body;
  const user = await User.findOne({ where: { email: email } });
  const tokenDuration = 60 * 60;

  if (user) {
    bcrypt.compare(password, user.password, function (err, result) {
      if (result) {
        const token = jwt.sign(
          { id: user.id, user: user.name },
          "this-secret-string-has-to-be-changed-and-moved-outside-of-git",
          {
            expiresIn: tokenDuration, // in seconds
          }
        );
        res.status(200).json({
          token: token,
        });
      } else {
        res.status(404).json({
          messages: [
            "User login failed!",
            "Make sure that your email and password are correct",
          ],
        });
      }
    });
  } else {
    res.status(404).json({ messages: ["User login failed!"] });
  }
};
