const express = require('express');
const router = express.Router();
const Db = require("../persistence/database.js");
const db = new Db("arduino_racer");


router.get('/', function (req, res, next) {
    res.render('login.ejs');
});

router.post('/', function (req, res, next) {
    let username = req.body.user;
    let password = req.body.password;
    console.log(username, password);
    db.findUser(username, password)
        .then(result => {
            if (result.notfound) {
                console.log(result);
                res.render("login", {login_error: "User not found..."})
            } else {
                console.log(result);
                req.session.user = result;
                res.redirect("/");
            }
        })
        .catch(err => {
            console.error(err);
            res.render("/login", {login_error: "Something went wrong..."})
        });
});

router.post('/register', function (req, res, next) {
    let username = req.body.user;
    let password = req.body.password;
    if (password !== req.body.confirmPassword) {
        res.render("login", {registration_error: "passwords don't match"})
    } else {
        db.addUser(username, password)
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