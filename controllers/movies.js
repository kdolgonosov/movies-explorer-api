// const bcrypt = require('bcryptjs');
const Movie = require('../models/movie');
const ValidationError = require('../errors/validationError');
const ForbiddenError = require('../errors/forbiddenError');
// const BadTokenError = require('../errors/badTokenError');
const NotFoundError = require('../errors/notFoundError');
// const NotUniqueEmailError = require('../errors/notUniqueEmailError');
const ServerError = require('../errors/serverError');

module.exports.getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .populate('owner')
    .then((cards) => res.send({ data: cards }))
    .catch(() => {
      next(new ServerError());
    });
};

module.exports.addMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    owner: req.user._id,
    nameRU,
    nameEN,
  })
    .then((movie) => {
      res.send({
        nameRU: movie.nameRU,
        description: movie.description,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ValidationError());
      }
      // if (err.code === 11000) {
      //   return next(new NotUniqueEmailError());
      // }
      return next(new ServerError());
    });
};
module.exports.removeMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(() => next(new NotFoundError()))
    .then((movie) => {
      if (!movie.owner.equals(req.user._id)) {
        return next(new ForbiddenError());
      }
      return movie.remove()
        .then(() => res.send(movie));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new ValidationError());
      }
      return next(new ServerError());
    });
};

// module.exports.getCards = (req, res, next) => {
//   Card.find({})
//     .populate('owner')
//     .then((cards) => res.send({ data: cards }))
//     .catch(() => {
//       next(new ServerError());
//     });
// };
