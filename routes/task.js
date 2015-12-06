var express = require('express');
var router = express.Router();
var dataManager = require('../Database/DataManager');
var exec = require('child_process').exec;
var fs = require('fs');
var mkdirp = require('mkdirp');

router.get('/:id', function(req, res, next)
{
    dataManager.getTask(req.params.id, function (task,langs,test, error) {
        res.render('task', {
            task: task,
            langs: langs,
            tests: test
        });
    });
});


router.put('/solution', function (req, res, next)
{
  console.log(req.body);
  var solution = req.body.solution;
  dataManager.getTask(req.body.taskID, function(task, error)
  {

    parseSolution(task, solution, function (response) {
      res.send(response);
    })

  });
});

function parseSolution(task, solution, cb)
{
  // TODO: Вот тут должен происходить процесс компиляции, тестирования и формироваться результат
  var response = new Object();
  response.status = 'success';
  response.message = '';
  if (solution.lang != 'bash')
  {
    response.status = 'error';
    response.message = 'Используй bash';
    cb(response);
    return;
  }
  mkdirp("tmp/tasks/"+task.id, function(err) {

    fs.writeFile('tmp/tasks/'+task.id+'/solution', solution.code, function(err) {
        if(err)
        {
            cb(response);
            return console.log(err);
        }
        fs.chmodSync('./tmp/tasks/'+task.id+'/solution', 0755);
        console.log("The file was saved!");

        checkTests(task, solution, response, cb, 0);

    });

});
}

function checkTests(task, solution, response, cb, indexTest)
{
  var test = task.tests[indexTest];
  console.log(test);
  exec('./tmp/tasks/'+task.id+'/solution '+test.in, function (err, stdout, stderr) {
      console.log('stdout='+stdout.toString());
      console.log(stderr);
      console.log('out='+test.out.toString());
      var ver_status = parseInt(stdout,10) == test.out;
      response.status = (ver_status && response.status == 'success')?'success':'error';
      if (ver_status)
      {
          response.message += 'Test № '+indexTest+' - success\n';
          response.message += 'out: '+stdout+'\n';
      }
      else {
          response.message += 'Test № '+indexTest+' - faild\n';
          response.message += 'out: '+(stdout?stdout:'\n');
          response.message += 'error: '+stderr+'\n';
      }
      indexTest++;
      if (indexTest == task.tests.length)
      {
        cb(response);
      }
      else {
        response.message+='\n';
        checkTests(task, solution, response, cb, indexTest);
      }
  });
};

module.exports = router;
