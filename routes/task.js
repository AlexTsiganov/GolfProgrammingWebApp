var express = require('express');
var router = express.Router();
var dataManager = require('../Database/DataManager');

router.get('/:id', function(req, res, next)
{
  dataManager.getTask(req.params.id, function(task, error)
  {
    res.render('task', { task: task,
                         langs: dataManager.getProgramLangs()});
  });
});

router.put('/solution', function (req, res, next)
{
  console.log(req.body);
  var taskID = req.body.task_id;
  var solution = req.body.solution;
  res.send(parseSolution(taskID, solution));
});

function parseSolution(taskID, solution)
{
  // TODO: Вот тут должен происходить процесс компиляции, тестирования и формироваться результат
  var response = new Object();
  if (taskID == 1)
  {
      response.status = 'success';
  }
  else {
    response.status = 'error';
  }
  return response;
}

module.exports = router;
