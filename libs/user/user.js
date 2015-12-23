var crypto = require('crypto');
var dataManager = require('../../Database/DataManager');
var log = require('../log/log')(module);

var addNewUser = function(name, plainPass, callback) {
    var salt = Math.random() + '';
    var hashedPassword = crypto.createHmac('sha1', salt).update(plainPass).digest('hex');

    //log.debug('salt: ' + salt + " hash_pass: " + hashedPassword);

    dataManager.writeUser(name, salt, hashedPassword, callback);

};

var checkIsLoginDataCorrect = function(name, plainPass, callback) {
    var wrongName = name.length < 4 || name.length > 20;
    var wrongPass = plainPass.length < 5 || plainPass.length > 20;
    callback(wrongName, wrongPass);
};

var checkIfUserExists = function(name, callback) {
    dataManager.getUser(name, function(err, rows, fields) {
        if (err) {
            callback(err);
            return;
        }
        //log.info("get username: " + name);
        //log.info(arguments);
        var row = rows[0];
        if (row && row.nickname) {
            callback(null, true);
        } else {
            callback(null, false);
        }
    });
};

var checkPassword = function(name, plainPass, callback) {
    dataManager.getUser(name, function(err, rows, fields) {
        if (err) {
            callback(err);
            return;
        }
        var user = rows[0];

        log.info("get user from DB");
        log.info(user);

        var generatedHashedPass =
            crypto.createHmac('sha1', user.salt).update(plainPass).digest('hex');
        var isPassCorrect = (user.hashed_password === generatedHashedPass);
            callback(null, isPassCorrect);
    });
};

exports.addNewUser = addNewUser;
exports.checkIsLoginDataCorrect = checkIsLoginDataCorrect;
exports.checkIfUserExists = checkIfUserExists;
exports.checkPassword = checkPassword;