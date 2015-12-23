var express = require('express');
var router = express.Router();
var dataManager = require('../Database/DataManager');

router.get('/', function(req, res, next) {
   dataManager.getTop10Users(function(toplist, error)
   {
      res.render('toplist', { title: 'Top users',
         toplist: toplist, username: req.session.username});
   });
});



module.exports = router;