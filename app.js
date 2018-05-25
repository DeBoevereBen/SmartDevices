const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const debug = require('debug')('arduino-racer:server');
const http = require('http');
const SocketModule = require('./domain/socket/SocketModule');
const ArduinoSerial = require('./domain/socket/ArduinoSerial');

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


app.use(express.static(path.join(__dirname, 'public')));




const loginRouter = require('./routes/login');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const highscoreRouter = require('./routes/highscores');



app.use('/login', loginRouter);

app.use('/', function (req, res, next) {
    let user = req.session.user;

    if (user === undefined || user === null) {
        res.render("login");
        return;
    }
    next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
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



/**
 * Get port from environment and store in Express.
 */

const server = http.createServer(app);
const io = require('socket.io')(server);
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

let arduino = new ArduinoSerial("COM5", 9600);
const socket = new SocketModule(io, arduino);
arduino.websocket = socket;

arduino.open();


/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}