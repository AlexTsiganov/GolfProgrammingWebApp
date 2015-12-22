var express = require('express');
var router = express.Router();
var log = require('../libs/log/log')(module);

/* GET sign in page. */
router.get('/', function(req, res, next) {
   res.render('login', { title: 'Sign in/Sign up  '});
   return;
});

router.post('/', function(req, res, next){
   var username = req.body.username;
   var password = req.body.password;
   log.info(" The user: <" + username + "> with password: <" + password + "> logged in.");
   res.end();
});

module.exports = router;
