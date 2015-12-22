var crypto = require('crypto');
var dataManager = require('../../Database/DataManager');
var log = require('../log/log')(module);

exports.addNewUser = function(name, plainPass) {
    var salt = Math.random() + '';
    var hashedPassword = crypto.createHmac('sha1', salt).update(plainPass).digest('hex');

    log.debug("salt - " + salt + " hashPass - " + hashedPassword);
};