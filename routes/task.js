var express = require('express');
var router = express.Router();
var dataManager = require('../Database/DataManager');
var exec = require('child_process').exec;
var fs = require('fs');
var mkdirp = require('mkdirp');

var log = require('../libs/log/log')(module);
var compile_system = require('../compile_system/compileSystem');
var test_system = require('../testing_system/testing');


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
    log.info("task: "+task.id);
    solution.id = 1;
    parseSolution(task, tests, solution, function (response) {
      res.send(response);
    })

  });
});

function emptyJSONResponse()
{
  var response = new Object();
  response.status = 'success';
  response.message = 'Empty response';
  return response;
}

function JSONResponseWithError(error)
{
  var response = new Object();
  response.status = 'error';
  response.message = 'error';
  return response;
}

function parseSolution(task, tests, solution, cb)
{
  writeSolutionToFile(solution, task, function (path_to_code)
  {
    if (solution.lang != 8)
    {
      // вот тут вызывать функции компиляции\тестиования
      var response = new Object();
      response.status = 'success';
      response.message = 'вот тут вызывать функции компиляции\тестиования';

      // dataManager.getObjects(solution.id, function(error, Test, Lang, Task, Solution) {
      //
      //     // call compiling function
      //     compile_system(Task, Lang, Solution, function(t){
      //         log.info(t);
      //         // call testing function
      //         test_system.testing(Lang, Task, Test, Solution);
      //     });
      //
      // });
      cb(response);
    }
    else
    {
      //bash_compile(task, tests, solution, cb);
      cb(emptyJSONResponse());
    }
  });
}

// events handling for testing function
test_system.on('runtimeError', function(res) {
    log.info(res.id_solution);           // id of checked solution
    log.info(res.result);                // result of testing
    log.info(res.error_log);             // log of the error
    log.info(res.number_of_fail_test);   // number of failed test
});

test_system.on('testFailed', function(res) {
    log.info(res.id_solution);           // id of checked solution
    log.info(res.result);                // result of testing
    log.info(res.error_log);             // log of the error
    log.info(res.number_of_fail_test);   // number of failed test
});

test_system.on('success', function(res){
    log.info(res.id_solution);           // id of checked solution
    log.info(res.result);                // result of testing
    log.info(res.error_log);             // log of the error
    log.info(res.number_of_fail_test);   // number of failed test
});

function writeSolutionToFile(solution, task, cb)
{
  var path_to_code = './tasks/'+task.id+'/solutions/'+solution.id+'/';
  mkdirp(path_to_code, function(err) {
    if (err) {
        throw err;
    }

    fs.writeFile(path_to_code+'/main', solution.code, function(err) {
      if (err) {
          throw err;
      }
        fs.chmodSync(path_to_code+'/main', 0755);
        cb(path_to_code+'/main');
    });
  });
}

// -------- #BASH --------

function bash_compile(task, tests, solution, cb)
{
  mkdirp("tmp/tasks/"+task.id, function(err) {
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
