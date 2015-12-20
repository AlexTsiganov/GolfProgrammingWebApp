var mysql      = require('mysql');
var config = require('config');

var connection = mysql.createConnection(config.get('dbConfig'));

connection.connect(function(err)
{
  if (err) {
    console.error('MySQL error connecting: ' + err.stack);
    return;
  }

  console.log('MySQL connected as id ' + connection.threadId);
},charset='utf8', init_command='SET NAMES UTF8');


var getAllTasks = function(cb) {
  connection.query("SELECT ID_TASK,TASKNAME,NICKNAME FROM TASKS, USERS where AUTHOR = ID_USER", function(err, rows, fields)
  {
    console.log('Rows ', rows);
    cb(rows, err);
  });
};

var getAllUsers = function(cb) {
  connection.query("SELECT * FROM users", function(err, rows, fields)
  {
    console.log('Rows ', rows);
    cb(rows, err);
  });
};

var getTestByTaskID = function(taskID, cb)
{
  connection.query("SELECT * FROM TESTS where ID_TASK = ? ",taskID, function(err, rows, fields)
  {
    console.log('Rows ', rows);
    cb(rows, err);
  });
};

var getAllProgramlangs = function(cb) {
  connection.query("SELECT ID_PROGRAM_LANGUAGE, LANGUAGE_NAME FROM PROGRAM_LANGUAGES", function(err, rows, fields)
  {
    console.log('Rows ', rows);
    cb(rows, err);
  });
};

var getTop10Users = function(cb) {
  connection.query("select ID_USER,NICKNAME,COUNT(ID_SOLUTION) as CNT,sum(POINTS) as SUMPOINTS" +
      " from USERS,SOLUTIONS where ID_USER=SOLUTION_USER_ID and ID_USER " +
      "in (select SOLUTION_USER_ID from SOLUTIONS group by SOLUTION_USER_ID " +
      "order by sum(POINTS)) group by ID_USER,NICKNAME order" +
      " by sum(POINTS) desc;", function(err, rows, fields)
  {
    console.log('Rows ', rows);
    cb(rows, err);
  });
};

//function (task,langs,test, error)
var getTask = function(id, cb) {
  connection.query("SELECT TASKS.*, NICKNAME FROM TASKS, USERS WHERE AUTHOR = ID_USER AND id_task = ?", id, function(err, rows, fields)
  {
    var task = rows[0];
    getAllProgramlangs(function(langs, err){
      getTestByTaskID(id, function(tests, err)
      {
        cb(task, langs, tests, err);
      });
    });

    return rows[0];
  });
};

var getTaskObject = function(solution_id, cb) {
    connection.query("SELECT * FROM TASKS where ID_TASK IN \
            (SELECT SOLUTION_TASK_ID from SOLUTIONS where ID_SOLUTION = ?)",
            solution_id, function(error, task) {
        cb(error, task);
    });
};

var getTestObject = function(solution_id, cb) {
    connection.query("SELECT * FROM TESTS where ID_TASK IN \
            (SELECT SOLUTION_TASK_ID from SOLUTIONS where ID_SOLUTION = ?)",
            solution_id, function(error, test) {
        cb(error, test);
    });
};

var getLangObject = function(solution_id, cb) {
    connection.query("SELECT * FROM PROGRAM_LANGUAGES where ID_PROGRAM_LANGUAGE IN \
            (SELECT PROGRAM_LANGUAGE from SOLUTIONS where ID_SOLUTION = ?)",
            solution_id, function(error, lang) {
        cb(error, lang);
    });
};

var getSolutionObject = function(solution_id, cb) {
    connection.query("SELECT * FROM SOLUTIONS where ID_SOLUTION = ?",
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
exports.getAllProgramlangs = getAllProgramlangs;
exports.getTask = getTask;
exports.getTestByTaskID = getTestByTaskID;
exports.getTop10Users = getTop10Users;
exports.getObjects = getObjects;