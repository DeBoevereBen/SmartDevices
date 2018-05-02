const mysql = require('mysql');
const User = require('../domain/User');
const Highscore = require('../domain/Highscore');
const Difficulty = require('../domain/Difficulty');
const credentials = require('./../credentials');

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
            "join difficulty d on d.id = h.difficultyId",
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

    Database.prototype.usernameExists = function (username) {

        return new Promise(function (resolve, reject) {
            pool.getConnection(function (err, connection) {
                if (err) reject(err);
                connection.query({
                    sql: Q.CHECK_USERNAME_UNIQUE,
                    values: [username]
                }, function (error, results, fields) {
                    console.log(results);
                    connection.release();
                    if (error) reject(error);
                    else {
                        if (results.length === 0) {
                            resolve({already_exists: false});
                        } else {
                            resolve({already_exists: true});
                        }
                    }
                })
            })
        })

    };

    Database.prototype.addUser = function (username, password) {
        let self = this;
        return new Promise(function (resolve, reject) {
            self.usernameExists(username)
                .then(result => {
                    if (result.already_exists) {
                        reject({already_exists: "Username is taken"});
                    } else {
                        pool.getConnection(function (err, connection) {
                            if (err) reject(err);
                            connection.query({
                                sql: Q.ADD_USER,
                                values: [username, password]
                            }, function (error, results, fields) {
                                connection.release();
                                if (error) reject(error);
                                else resolve({succes: true});
                            });
                        });
                    }
                })
        })
    };

    // resolves with a user, or an error object if the user is not found
    Database.prototype.findUser = function (username, password) {
        return new Promise(function (resolve, reject) {
            pool.getConnection(function (err, connection) {
                if (err) reject(err);

                connection.query({
                    sql: Q.FIND_USER_BY_NAME,
                    values: [username, password]
                }, function (error, results, fields) {
                    if (error) reject(error);

                    connection.release();

                    // console.log(results);
                    if(results.length === 0){
                        resolve({"notfound": "user not found"});
                    } else {

                        let user = new User(results[0].id, results[0].username, results[0].password);
                        resolve(user);
                    }
                });
            });
        });

    };

    Database.prototype.getAllHighscores = function(){
        return new Promise(function(resolve, reject){
            pool.getConnection(function (err, connection) {
                if(err) reject(err);

                connection.query({
                    sql: Q.FIND_ALL_HIGHSCORES,
                    values: []
                }, function (error, results, fields) {
                    if (error) reject(error);

                    connection.release();

                    highscores = [];
                    results.forEach(result =>{
                        highscores.push(new Highscore(result.username, result.time, result.difficulty));
                    });


                    resolve(highscores);
                });
            });
        });

    };

    // expects a difficulty name, resolves with a dfficulty object with the name and id
    Database.prototype.findDifficulty = function(difficulty){
        return new Promise(function(resolve, reject){
            pool.getConnection(function (err, connection) {
                if(err) reject(err);

                connection.query({
                    sql: Q.FIND_DIFFICULTY,
                    values: [difficulty]
                }, function (error, results, fields) {
                    if (error) reject(error);

                    connection.release();

                    if(results.length === 0){
                        resolve({"notfound": "difficulty not found"});
                    } else {

                        resolve(new Difficulty(results[0].id, results[0].name));
                    }
                });
            });
        });

    };


    Database.prototype.addHighscore = function(userId, time, difficultyName){

        return this.findDifficulty(difficultyName)
            .then(difficultyObject => {
                return new Promise(function(resolve, reject){
                    pool.getConnection(function (err, connection) {
                        if(err) reject(err);
                        connection.query({
                            sql: Q.ADD_HIGHSCORE,
                            values: [userId, time, difficultyObject.id]
                        }, function (error) {
                            if (error)
                                reject(error);
                            else{
                                resolve({statusCode: "200"});
                            }
                        });
                    });
                });
            });



    };

    return Database;
})();

module.exports = Database;


