const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const auth = require('./middlewares/auth');
const {
  createUser, signIn, getUserInfo, updateUserInfo,
} = require('./controllers/users');
const { getMovies, addMovie, removeMovie } = require('./controllers/movies');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
mongoose.connect('mongodb://localhost:27017/filmsdb');
app.use(requestLogger);
app.post('/signup', createUser);
app.post('/signin', signIn);

app.use(auth);

app.get('/users/me', getUserInfo);
app.patch('/users/me', updateUserInfo);
app.get('/movies', getMovies);
app.post('/movies', addMovie);
app.delete('/movies/:movieId', removeMovie);

app.use(errorLogger);

app.listen(PORT, () => {
  console.log(`Сервер запущен на порте: ${PORT}`);
});
