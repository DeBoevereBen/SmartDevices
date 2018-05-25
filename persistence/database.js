const mysql = require('mysql');
const User = require('../domain/User');
const Highscore = require('../domain/Highscore');
const Difficulty = require('../domain/Difficulty');
const credentials = require('./../credentials');
const util = require("../util");

const Database = (function () {

    const config = {
        host: "localhost",
        port: 3306
    };

    const Q = {
        FIND_USER_BY_NAME: "select * from users where username=? and password=?",
        FIND_DIFFICULTY: 'select * from difficulty where name = ?',
        FIND_ALL_HIGHSCORES: "select u.username, d.name as difficulty, h.time " +
        "from highscores h " +
        "join users u on h.userId = u.id " +
        "join difficulty d on d.id = h.difficultyId " +
        "order by h.time",
        ADD_HIGHSCORE: "INSERT INTO highscores(userId, time, difficultyId) VALUES(?,?,?)",
        ADD_USER: "INSERT INTO users(username, password) VALUES(?, ?)",
        CHECK_USERNAME_UNIQUE: "SELECT * FROM users WHERE username = ?"
    };

    let pool = null;

    function Database(dbName) {
        config.database = dbName;
        config.user = credentials.username;
        config.password = credentials.password;

        pool = mysql.createPool(config);
    }

    Database.prototype.getConnection = function () {
        return new Promise(function (resolve, reject) {
            pool.getConnection(function (err, connection) {
                if (err) {
                    reject(err);
                } else {
                    resolve(connection);
                }
            });
        })
    };

    Database.prototype.query = function (connection, queryParams) {
        return new Promise(function (resolve, reject) {
            connection.query(queryParams, function (error, results) {
                connection.release();

                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    };

    Database.prototype.usernameExists = function (username) {
        let self = this;
        return this.getConnection()
            .then(function (connection) {
                return self.query(connection, {
                    sql: Q.CHECK_USERNAME_UNIQUE,
                    values: [username]
                })
            })
            .then(results => {
                if (results.length === 0) {
                    return Promise.resolve({already_exists: false});
                } else {
                    return Promise.resolve({already_exists: true});
                }
            })

    };

    Database.prototype.addUser = function (username, password) {
        let self = this;
        return self.usernameExists(username)
            .then(result => {
                if (result.already_exists) {
                    return Promise.resolve({already_exists: "Username is taken"});
                } else {
                    return Promise.resolve();
                }
            })
            .then(_ => self.getConnection())
            .then(conn => self.query(conn, {
                sql: Q.ADD_USER,
                values: [username, password]
            }))
            .then(_ => Promise.resolve( {succes: true}));

    };

    // resolves with a user, or an error object if the user is not found
    Database.prototype.findUser = function (username, password) {
        // let self = this;
        return this.getConnection()
            .then(conn => this.query(conn, {
                sql: Q.FIND_USER_BY_NAME,
                values: [username, password]
            }))
            .then(results => {
                if (results.length === 0) {
                    return Promise.resolve({"notfound": "user not found"});
                } else {

                    let user = new User(results[0].id, results[0].username, results[0].password);
                    return Promise.resolve(user);
                }
            });

    };

    Database.prototype.getAllHighscores = function () {
        return this.getConnection()
            .then(conn => this.query(conn, {
                sql: Q.FIND_ALL_HIGHSCORES,
                values: []
            }))
            .then(results => {
                highscores = [];
                results.forEach(result => {
                    highscores.push(new Highscore(result.username, util.formatTime(result.time), result.difficulty));
                });


                return Promise.resolve(highscores);
            });


    };

    // expects a difficulty name, resolves with a dfficulty object with the name and id
    Database.prototype.findDifficulty = function (difficulty) {
        return this.getConnection()
            .then(conn => this.query(conn, {
                sql: Q.FIND_DIFFICULTY,
                values: [difficulty]
            }))
            .then(results => {
                if (results.length === 0) {
                    return Promise.resolve({"notfound": "difficulty not found"});
                } else {

                    return Promise.resolve(new Difficulty(results[0].id, results[0].name));
                }
            });


    };


    Database.prototype.addHighscore = function (userId, time, difficultyName) {
        let self = this;

        function addHighscorePromise(difficulty){
            return self.getConnection()
                .then(conn => self.query(conn, {
                    sql: Q.ADD_HIGHSCORE,
                    values: [userId, time, difficulty.id]
                }))
                .then(_ => Promise.resolve({statusCode: "200"}))
        }

        return this.findDifficulty(difficultyName)
            .then(difficulty => addHighscorePromise(difficulty));


    };

    return Database;
})();

module.exports = Database;


