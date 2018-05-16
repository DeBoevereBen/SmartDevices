const express = require('express');
const router = express.Router();
const Db  = require('../persistence/database');
let db = new Db('arduino_racer');

/* GET home page. */
router.get('/', function (req, res, next) {
    db.getAllHighscores().then(function(highscores) {
        console.log(highscores);
        res.render('highscores', highscores)
    });
});

router.post("/", function(req,res,next) {
    if (req.body) {
        let time = req.body.time;
        let userID = req.session.user.id;
        db.addHighscore(userID, time, "normal").then(function() {
        }).catch(function(){

        });
    }
});

module.exports = router;