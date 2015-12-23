var express = require('express');
var router = express.Router();
var user = require('../libs/user/user');
var HttpError = require('../libs/errors/HttpError');

var log = require('../libs/log/log')(module);

/* GET sign in page. */
router.get('/', function(req, res, next) {
   res.render('login', { title: 'Sign in/Sign up  '});
   return;
});

router.post('/', function(req, res, next){
   var username = req.body.username;
   var password = req.body.password;

   log.info(" The user: <" + username + "> with password: <" + password + "> trying to login.");



   user.addNewUser(username, password, function(err, result) {
      if (err)  {

         log.warn('Error happened, msg - ' + err.message + ". Status - " + err.status);

         res.status(err.status);
         res.send({message: err.message});

      } else {
         log.info('User: ' + username + " was add into DB.");
         res.end();
      }
   });

});

module.exports = router;
