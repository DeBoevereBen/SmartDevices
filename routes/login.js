const express = require('express');
const router = express.Router();

router.get('/', function (req, res, next) {
    res.render('login.ejs');
});

router.post('/', function (req, res, next) {
   console.log(req.body);
   res.send("login");
});

router.post('/register', function (req, res, next) {
   console.log(req.body);
   if (req.body.password !== req.body.confirmPassword) {
       res.render("login", {registration_error: "passwords don't match"})
   }
   res.send("register");
});

module.exports = router;
