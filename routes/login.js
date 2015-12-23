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
   log.info(" The user: <" + username + "> with password: <" + password + "> logged in.");
   user.addNewUser(username, password, function(err, result) {
      if (err instanceof HttpError)  {
         if (err instanceof HttpError) {

         }
         log.warn('Error happened, msg - ' + err.message + ". Status - " + err.status);
         /*res.render('error', {
            message: err.message,
            error: err
         });
         res.end();*/
         next(err);
      }
      log.info('User: ' + username + " was add into DB.");
      log.info('His hashed pass: ' + password + " .");
      res.end();
   });

});

module.exports = router;
