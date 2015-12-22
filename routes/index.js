var express = require('express');
var router = express.Router();
var dataManager = require('../Database/DataManager');

/* GET home page. */
router.get('/', function(req, res, next)
{
  dataManager.getAllTasks(function(tasks, error)
  {
    if (error) {
        throw error;
    }
    res.render('index', { title: 'Golf Programming', tasks: tasks});
  });

});

module.exports = router;
