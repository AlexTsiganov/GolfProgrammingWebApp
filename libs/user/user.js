var crypto = require('crypto');
var dataManager = require('../../Database/DataManager');
var log = require('../log/log')(module);

var addNewUser = function(name, plainPass, callback) {
    var salt = Math.random() + '';
    var hashedPassword = crypto.createHmac('sha1', salt).update(plainPass).digest('hex');

    log.debug('salt: ' + salt + " hash_pass: " + hashedPassword);

    dataManager.writeUser(name, salt, hashedPassword, callback);

};

exports.addNewUser = addNewUser;