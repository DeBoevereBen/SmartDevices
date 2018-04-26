const mysql = require('mysql');
const User = require('../domain/User');

const Database = (function () {

    const config = {
        host: "localhost",
        port: 3306
    };

    const Q = {
        FIND_USER_BY_NAME: "select * from users where username=? and password=?"
    };

    let pool = null;

    function Database(dbName, username, password) {
        config.database = dbName;
        config.user = username;
        config.password = password;

        pool = mysql.createPool(config);
    }

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

                    if (results.length === 0) {
                        resolve({"notfound": "user not found"});
                    } else {
                        let user = new User(results[0].username, results[0].password);
                        resolve(user);
                    }
                });
            });
        });

    };

    return Database;
})();

module.exports = Database;


