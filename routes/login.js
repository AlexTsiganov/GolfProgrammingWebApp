var express = require('express');
var router = express.Router();

/* GET sign in page. */
router.get('/', function(req, res, next) {
   res.render('login', { title: 'Golf Programming'});
   return;
});

router.post('/', function(req, res, next){
   var username = req.body.username;
   var password = req.body.password;
   res.send("uname: " + username + "\npass: " + password);
});

module.exports = router;
