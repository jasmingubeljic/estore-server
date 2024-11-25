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

  if (user) {
    bcrypt.compare(password, user.password, function (err, result) {
      if (result) {
        const token = jwt.sign({ user }, "secretklsajdfalskjdf", {
          expiresIn: "2h",
        });
        res
          .status(200)
          .json({ token: token, user: user.name, userId: user.id });
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
