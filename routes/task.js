var express = require('express');
var router = express.Router();
var dataManager = require('../Database/DataManager');

router.get('/:id', function(req, res, next)
{
  dataManager.getTask(req.params.id, function(task, error)
  {
    res.render('task', { task: task,
                         langs: ['c++', 'Java', 'Python'] });
  });
});

router.put('/solution', function (req, res, next)
{
  res.send(req.body);
  console.log(req.body);
});

module.exports = router;
