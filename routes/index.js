var express = require('express');
var router = express.Router();
var dataManager = require('../Database/DataManager');

var tasks = [
  { id: 1,
    href: '/task/1',
    title: 'Test task title with c language',
    description: 'Description',
    author: 'Alex'},
  { id: 2,
    href: '/task/2',
    title: 'Test task title with c++ language',
    description: 'Description',
    author: 'Ivan'}];
/* GET home page. */
router.get('/', function(req, res, next)
{
  dataManager.getAllTasks(function(tasks, error)
  {
    res.render('index', { title: 'Golf Programming',
                          tasks: tasks});
  });

});

module.exports = router;
