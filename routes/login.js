var express = require('express');
var router = express.Router();

/* GET sign in page. */
router.get('/', function(req, res, next) {
   res.render('login', { title: 'Golf Programming'});
   return;
});


module.exports = router;
