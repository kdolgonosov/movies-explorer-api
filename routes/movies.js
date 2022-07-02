const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getMovies, addMovie, removeMovie } = require('../controllers/movies');
const { urlRegex } = require('../constants/regex');

router.get('/movies', getMovies);
router.post('/movies', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.string().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(urlRegex),
    trailerLink: Joi.string().required().pattern(urlRegex),
    thumbnail: Joi.string().required().pattern(urlRegex),
    movieId: Joi.string().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), addMovie);
router.delete('/movies/:movieId', celebrate({
  body: Joi.object().keys({
    movieId: Joi.string().required(),
  }),
}), removeMovie);

module.exports = router;
