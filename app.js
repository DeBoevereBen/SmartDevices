var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
let socket = null;
const session = require('express-session');
const Database = require('./persistence/database.js');
let db = new Database("arduino_racer");

const sessionConfig = {
    key: 'mySessionCookieName',
    secret: "azerty123",
    resave: true, saveUninitialized: false
};

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(session(sessionConfig));

app.post('/speed', function (req, res, next) {
    let message = req.body.message;
    arduino.write(`{${message}}`);
    res.end();
});

app.post("/highscore", function(req,res,next) {
    if (req.body) {
        let time = req.body.time;
        let userID = req.session.user.id;
        db.addHighscore(userID, time, "normal").then(function() {

        }).catch(function(){

        });
    }
    console.log(req.body.time);
});

app.use(express.static(path.join(__dirname, 'public')));

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const loginRouter = require('./routes/login');
const highscoreRouter = require('./routes/highscores');

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/login', loginRouter);
app.use('/highscores', highscoreRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});


module.exports = app;
