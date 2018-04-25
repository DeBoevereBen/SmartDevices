var express = require('express');
var router = express.Router();

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
