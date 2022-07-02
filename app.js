const express = require('express');
require('dotenv').config();

const { NODE_ENV, DB_URL } = process.env;
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const helmet = require('helmet');
const errorHandler = require('./middlewares/errorHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;
const app = express();
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

if (NODE_ENV === 'production') {
  mongoose.connect(DB_URL);
} else {
  mongoose.connect('mongodb://localhost:27017/filmsdb');
}
app.use(requestLogger);
app.use('/', require('./routes'));

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Сервер запущен на порте: ${PORT}`);
});
