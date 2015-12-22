var express = require('express');
var router = express.Router();
var dataManager = require('../Database/DataManager');
var exec = require('child_process').exec;
var fs = require('fs');
var mkdirp = require('mkdirp');
var log = require('../libs/log.js')(module);

router.get('/:id', function(req, res, next)
{
    dataManager.getTask(req.params.id, function (task,langs,test, error) {
        if (error) {
            throw error;
        }

        res.render('task', {
            task: task,
            langs: langs,
            tests: test
        });
    });
});


router.put('/solution', function (req, res, next)
{
  log.info(req.body);
  var solution = req.body.solution;
  dataManager.getTask(req.body.taskID, function(task, langs, tests, error)
  {
    log.info("task: "+task.ID_TASK);
    parseSolution(task, tests, solution, function (response) {
      res.send(response);
    })

  });
});

function parseSolution(task, tests, solution, cb)
{
  // TODO: Вот тут должен происходить процесс компиляции, тестирования и формироваться результат
  var response = new Object();
  response.status = 'success';
  response.message = '';
  if (solution.lang != 8)
  {
    response.status = 'error';
    response.message = 'Используй bash';
    cb(response);
    return;
  }
  mkdirp("tmp/tasks/"+task.ID_TASK, function(err) {
    if (err) {
        throw err;
    }
    fs.writeFile('tmp/tasks/'+task.ID_TASK+'/solution', solution.code, function(err) {
        if(err)
        {
            cb(response);
            return log.info(err);
        }
        fs.chmodSync('./tmp/tasks/'+task.ID_TASK+'/solution', 0755);
        log.info("The file was saved!");
        log.info("tCount: "+ tests.length);
        checkTests(task, tests, solution, response, cb, 0);

    });

});
}

function checkTests(task, tests, solution, response, cb, indexTest)
{

  var test = tests[indexTest];
  log.info(test);
  exec('./tmp/tasks/'+task.ID_TASK+'/solution '+test.INPUT_DATA, function (err, stdout, stderr) {
      log.info('stdout='+stdout.toString());
      log.info(stderr);
      log.info('out='+test.OUTPUT_DATA.toString());
      var ver_status = parseInt(stdout,10) == test.OUTPUT_DATA;
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
      if (indexTest == tests.length)
      {
        cb(response);
      }
      else {
        response.message+='\n';
        checkTests(task, tests, solution, response, cb, indexTest);
      }
  });
};

module.exports = router;
