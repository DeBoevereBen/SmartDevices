const express = require('express');
const router = express.Router();
const sqluserService = require("./../persistence/mysqlUserService.js");
const userService = new sqluserService("arduino_racer", "ben", "ben");

router.get('/', function (req, res, next) {
    res.render('login.ejs');
});

router.post('/', function (req, res, next) {
    let username = req.body.user;
    let password = req.body.password;
    console.log(username, password);
    userService.findUser(username, password)
        .then(result => {
            if (result.notfound) {
                console.log(result);
                res.render("login", {login_error: "User not found..."})
            } else {
                console.log(result);
                req.session.user = result;
                res.render("index", {username: result.username});
            }
        })
        .catch(err => {
            console.error(err);
            res.render("/login", {login_error: "Something went wrong..."})
        });
});

router.post('/register', function (req, res, next) {
    console.log(req.body);
    let username = req.body.user;
    let password = req.body.password;
    if (password !== req.body.confirmPassword) {
        res.render("login", {registration_error: "passwords don't match"})
    } else {
        userService.addUser(username, password)
            .then(result => {
                if (result.succes) {
                    res.render("login", {message: "Succesfully registered. You can now login."})
                } else {
                    res.render("login", {registration_error: result.already_exists})
                }
            })
            .catch(err => {
                res.render("login", {registration_error: "Something went wrong"})
            });
    }
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