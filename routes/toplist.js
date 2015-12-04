var express = require('express');
var router = express.Router();
var dataManager = require('../Database/DataManager');

router.get('/', function(req, res, next) {
   res.render('toplist', { title: 'Golf Programming'});
   return;
});




module.exports = router;