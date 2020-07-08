const express = require('express');
const path = require('path');
const logger = require('morgan');
const models = require('./models/index');
const apiRouter = require('./routes/index');
const isAuth = require('./validator/isAuth');
const history = require('connect-history-api-fallback');

const app = express();

models.sequelize.sync().then(() => {
    console.log('DB 연결 성공');
}).catch(err => {
    console.log('DB 연결 실패');
    console.log(err);
    process.exit(1);
})

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(history());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', isAuth);
app.use('/api', apiRouter);

module.exports = app;
