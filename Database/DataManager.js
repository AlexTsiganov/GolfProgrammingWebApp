var mysql      = require('mysql');
var config = require('config');

var connection = mysql.createConnection(config.get('dbConfig'));
var log = require('../libs/log.js')(module);

connection.connect(function(err)
{
  if (err) {
    console.error('MySQL error connecting: ' + err.stack);
    return;
  }

  log.info('MySQL connected as id ' + connection.threadId);
},charset='utf8', init_command='SET NAMES UTF8');


var getAllTasks = function(cb) {
  connection.query("SELECT tasks.id,name,users.nickname FROM tasks, users where author = users.id", function(err, rows, fields)
  {
    log.info('Rows ', rows);
    cb(rows, err);
  });
};

var getAllUsers = function(cb) {
  connection.query("SELECT * FROM users", function(err, rows, fields)
  {
    log.info('Rows ', rows);
    cb(rows, err);
  });
};

var getTestByTaskID = function(taskID, cb)
{
  connection.query("SELECT * FROM tests WHERE task_id = ? ",taskID, function(err, rows, fields)
  {
    log.info('Rows ', rows);
    cb(rows, err);
  });
};

var getAllProgramLangs = function(cb) {
  connection.query("SELECT id, name FROM program_languages", function(err, rows, fields)
  {
    log.info('Langs: ', rows);
    cb(rows, err);
  });
};

var getTop10Users = function(cb) {
  connection.query("select users.id,nickname,COUNT(solutions.id) as count,sum(points) as total" +
        " from users,solutions where users.id=user_id and users.id " +
        "in (select user_id from solutions group by user_id " +
        "order by sum(points)) group by users.id,nickname order" +
        " by sum(points) desc", function(err, rows, fields)
  {
    log.info('Rows ', rows);
    cb(rows, err);
  });
};

//function (task,langs,test, error)
var getTask = function(id, cb) {
  connection.query("SELECT tasks.id,name,description, nickname FROM tasks, users WHERE author = users.id AND tasks.id = ?", id, function(err, rows, fields)
  {
    var task = rows[0];
    getAllProgramLangs(function(langs, err){
      getTestByTaskID(id, function(tests, err)
      {
        cb(task, langs, tests, err);
      });
    });

    return rows[0];
  });
};

var getTaskObject = function(solution_id, cb) {
    connection.query("SELECT * FROM tasks where id IN \
            (SELECT task_id from solutions where id = ?)",
            solution_id, function(error, task) {
        cb(error, task);
    });
};

var getTestObject = function(solution_id, cb) {
    connection.query("SELECT * FROM tests where id IN \
            (SELECT task_id from solutions where id = ?)",
            solution_id, function(error, test) {
        cb(error, test);
    });
};

var getLangObject = function(solution_id, cb) {
    connection.query("SELECT * FROM program_languages where id IN \
            (SELECT program_language from solutions where id = ?)",
            solution_id, function(error, lang) {
        cb(error, lang);
    });
};

var getSolutionObject = function(solution_id, cb) {
    connection.query("SELECT * FROM solutions where id = ?",
            solution_id, function(error, solution) {
        cb(error, solution);
    });
};

var getObjects = function(solution_id, cb) {
    var Test = null;
    var Lang = null;
    var Task = null;
    var Solution = null;
    getTaskObject(solution_id, function(error, task) {
        Task = task;
        getTestObject(solution_id, function(error, test) {
            Test = test;
            getLangObject(solution_id, function(error, lang) {
                Lang = lang;
                getSolutionObject(solution_id, function(error, solution) {
                    Solution = solution;
                    cb(error, Test, Lang, Task, Solution);
                });
            });
        });
    });
};

var sql1 = "SET CHARACTER SET utf8";
connection.query(sql1, function (err, result) {
  var sql = "SET SESSION collation_connection ='utf8_general_ci";
  connection.query(sql,  function (err, result) {
  });
});

exports.getAllTasks = getAllTasks;
exports.getAllUsers = getAllUsers;
exports.getAllProgramLangs = getAllProgramLangs;
exports.getTask = getTask;
exports.getTestByTaskID = getTestByTaskID;
exports.getTop10Users = getTop10Users;
exports.getObjects = getObjects;
