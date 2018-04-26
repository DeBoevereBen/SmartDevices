var express = require('express');
var router = express.Router();
const MysqlUserService = require('../persistence/mysqlUserService');

var userService = new MysqlUserService("arduino_racer", "kevin", "kevin"); //TODO get credentials from config fiile
/* GET home page. */
router.get('/', function (req, res, next) {
    userService
        .findUser("joske", "vermeulen")
        .then(result => {
            if (result.notfound) {
                console.log("User not found");
            } else {
                console.log(result);

                userService.addHighscore(result.id, 10000, "normal").then(console.log).catch(console.error);
            }

        });

    console.log("highscores");
    userService.getAllHighscores().then(console.log);

    res.render('index', {title: 'Express'});

});

module.exports = router;