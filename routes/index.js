const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    let user = req.session.user;

    if (user === undefined || user === null) {
        res.render("login");
    } else {
        let userObj = {username: user.username};
        res.render("index", userObj);
    }
});

router.get('/logout', function (req, res, next) {
    req.session.destroy();
    res.render('login');
});

module.exports = router;