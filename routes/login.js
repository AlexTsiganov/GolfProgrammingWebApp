var express = require('express');
var router = express.Router();
var user = require('../libs/user/user');
var HttpError = require('../libs/errors/HttpError');

var log = require('../libs/log/log')(module);

/* GET sign in page. */
router.get('/', function(req, res, next) {
   res.render('login', { title: 'Sign in/Sign up  ', username: req.session.username});
});

router.post('/', function(req, res, next){
   var username = req.body.username;
   var password = req.body.password;

   log.info(" The user: <" + username + "> with password: <" + password + "> trying to login.");

   // checkIsLoginDataCorrect
   user.checkIsLoginDataCorrect(username, password, function(wrongName, wrongPass) {
      if (wrongName || wrongPass) {
         var err = new HttpError(403, "Wrong name or pass. Name must be from 4 to 20 chars. Pass must be from 5 to 20 chars.");

         res.status(err.status);
         res.send({message: err.message});
      } else {

         // if logdata correct - checkIfUserExists
         user.checkIfUserExists(username, function(err, isExist) {
            if (err) {
               res.status(err.status || 500);
               res.send({message: err.message});
            } else {

               // addNewUser if it isn't exist
               if (!isExist) {
                  user.addNewUser(username, password, function(err, result) {
                     if (err)  {

                        log.warn('Error happened, msg - ' + err.message + ". Status - " + err.status);

                        res.status(err.status);
                        res.send({message: err.message});

                     } else {

                        // remember username in session(username is unique). login successful
                        req.session.username = username;
                        log.info('User: ' + username + " was add into DB.");
                        res.end();
                     }
                  });
               } else {

                  // if user exist - check his pass
                  user.checkPassword(username, password, function(err, isPassCorrect) {
                     if (err) {
                        res.status(err.status || 500);
                        res.send({message: err.message});
                     } else {

                        // if pass correct - remember username in session. login successful
                        if (isPassCorrect) {
                           req.session.username = username;
                           log.info('User: ' + username + " was succesfully sign up");
                           log.info('Username from cookie: ' + username);
                           res.end();
                        } else {

                           // if pass incorrect - say that login is busy.
                           var err = new HttpError(403, "login is busy");
                           res.status(err.status);
                           res.send({message: err.message});
                        }
                     }
                  });
               }
            }
         });
      }
   });
});

module.exports = router;
