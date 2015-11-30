var express = require('express');
var router = express.Router();
var dataManager = require('../Database/DataManager');
var spawn = require('child_process').spawn;
var child_process = require('child_process');

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
  var solution = req.body.solution;
  dataManager.getTask(req.body.taskID, function(task, error)
  {
    res.send(parseSolution(task, solution));
  });
});

function parseSolution(task, solution)
{
  // TODO: Вот тут должен происходить процесс компиляции, тестирования и формироваться результат
  var response = new Object();
  child_process.exec('echo $PATH', function (err, stdout, stderr) {
      console.log(stdout);
  });
  child_process.exec("echo '"+solution.code+"' > Alex\\ test\\ task/test", function (err, stdout, stderr) {
      console.log(stdout);
  });


   child_process.exec('./Alex\\ test\\ task/test ' + '-asdss', function (err, stdout, stderr) {
       console.log(stdout);
       console.log(stderr);

 if (stderr)
  {
      response.status = 'error';
  }
  else {
    response.status = 'success';
  }
  return response;
   });


  // var code = "echo 'alexx'";
  // var child = spawn("ps", ['--help']);
  //
  // child.stdout.on('data',
  //     function (data) {
  //         console.log('tail output: ' + data);
  //     }
  // );
  //
  // child.stderr.on('data',
  //     function (data) {
  //         console.log('err data: ' + data);
  //     }
  // );

console.log("good");

}



module.exports = router;
