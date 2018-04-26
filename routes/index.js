var express = require('express');
var router = express.Router();
const MysqlUserService = require('../persistence/mysqlUserService');

var userService = new MysqlUserService("arduino_racer", "kevin", "kevin"); //TODO get credentials from config fiile
/* GET home page. */
router.get('/', function (req, res, next) {
    let user = req.session.user;
    console.log("logged in user: ", user);
    if (user === undefined || user === null) {
        res.render("login");
    } else {
        res.render("index");
    }
});

router.get('/logout', function (req, res, next) {
    console.log("logout");
    req.session.destroy();
    res.render('login');
});

module.exports = router;