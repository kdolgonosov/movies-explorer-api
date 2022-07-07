const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ValidationError = require('../errors/validationError');
const BadTokenError = require('../errors/badTokenError');
const NotFoundError = require('../errors/notFoundError');
const NotUniqueEmailError = require('../errors/notUniqueEmailError');
const ServerError = require('../errors/serverError');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.createUser = (req, res, next) => {
  const { email, password, name } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
    }))
    .then((user) => {
      res
        .send({
          email: user.email,
          name: user.name,
        });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ValidationError());
      }
      if (err.code === 11000) {
        return next(new NotUniqueEmailError());
      }
      return next(new ServerError());
    });
};

module.exports.signIn = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'very-stronk-secret',
        {
          expiresIn: '7d',
        },
      );

      res.send({ token });
    })
    .catch(() => next(new BadTokenError('Неверные почта или пароль')));
};

module.exports.getUserInfo = (req, res, next) => {
  const id = req.user._id;
  User.findById(id)
    .then((user) => {
      if (!user) {
        return next(new NotFoundError());
      }
      return res.send({
        email: user.email,
        name: user.name,
      });
    });
};

module.exports.updateUserInfo = (req, res, next) => {
  const id = req.user._id;
  const { email, name } = req.body;
  User.findByIdAndUpdate(
    id,
    { email, name },
    { new: true, runValidators: true },
  )
    .then((user) => {
      res.send({
        email: user.email,
        name: user.name,
        _id: user._id,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ValidationError());
      }
      if (err.code === 11000) {
        return next(new NotUniqueEmailError());
      }
      return next(new ServerError());
    });
};
