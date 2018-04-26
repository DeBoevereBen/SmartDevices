var express = require('express');
var router = express.Router();
const MysqlUserService = require('../persistence/mysqlUserService');

var userService = new MysqlUserService("arduino_racer", "kevin", "kevin"); //TODO get credentials from config fiile
/* GET home page. */

router.get('/', function (req, res, next) {
    let user = req.session.user;
    if (user == undefined || user == null) {
        res.render("login");
    } else {
        res.render('index', {title: 'Express'});
    }
});

module.exports = router;