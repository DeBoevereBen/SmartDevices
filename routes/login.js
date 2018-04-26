const express = require('express');
const router = express.Router();
const sqluserService = require("./../persistence/mysqlUserService.js");
const userService = new sqluserService("arduino_racer", "ben", "ben");

router.get('/', function (req, res, next) {
    res.render('login.ejs');
});

router.post('/', function (req, res, next) {
    let username = req.body.username;
    let password = req.body.password;
    userService.findUser(username, password)
        .then(result => {
            if (result.notfound) {
                console.log(result);
                res.render("login", {login_error: "User not found..."})
            } else {
                console.log(result);
                res.render("index");
            }
        })
        .catch(err => {
            console.error(err);
            res.render("login", {login_error: "Something went wrong..."})
        });
});

router.post('/register', function (req, res, next) {
    console.log(req.body);
    if (req.body.password !== req.body.confirmPassword) {
        res.render("login", {registration_error: "passwords don't match"})
    }
    res.send("register");
});

module.exports = router;

/*
router.get('/', function(req, res, next) {
    userService
        .findUser("joske","vermeule")
        .then(result => {
          if(result.notfound){
            console.log("User not found");
          } else {
              console.log(user);
          }
        });
  res.render('index', { title: 'Express' });
*/