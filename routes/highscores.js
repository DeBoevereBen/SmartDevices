const express = require('express');
const router = express.Router();
const Db  = require('../persistence/database');
let db = new Db('arduino_racer');

/* GET home page. */
router.get('/', function (req, res, next) {
    db.getAllHighscores().then(highscores => res.render('highscores', highscores));
});

module.exports = router;