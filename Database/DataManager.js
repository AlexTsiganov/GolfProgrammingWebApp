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
  connection.query("SELECT ID_TASK,TASKNAME,NICKNAME FROM tasks,users where AUTHOR = ID_USER", function(err, rows, fields)
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
  connection.query("SELECT * FROM tests where id_task = ? ",taskID, function(err, rows, fields)
  {
    console.log('Rows ', rows);
    cb(rows, err);
  });
};

var getAllProgramlangs = function(cb) {
  connection.query("SELECT ID_PROGRAM_LANGUAGE, LANGUAGE_NAME FROM program_languages", function(err, rows, fields)
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

var getProgramLangs = function(argument) {
  return [{'lang': 'c++'}, {'lang': 'Java'}, {'lang': 'Python'}];
};

//function (task,langs,test, error)
var getTask = function(id, cb) {
  connection.query("SELECT tasks.*, NICKNAME FROM tasks, users WHERE AUTHOR = ID_USER AND id_task = ?", id, function(err, rows, fields)
  {
    var task = rows[0];
    getAllProgramlangs(function(langs, err){
      getTestByTaskID(id, function(tests, err)
      {
        task.tests = [ {'in': '1 2', 'out': '3'}, {'in': '2 3', 'out': '5'}];
        //task['tests'] = 
        cb(task, langs, tests, err);
      });
    });

    return rows[0];
  });
};

var sql1 = "SET CHARACTER SET utf8";
connection.query(sql1, function (err, result) {
  var sql = "SET SESSION collation_connection ='utf8_general_ci";
  connection.query(sql,  function (err, result) {
  });
});

exports.getProgramLangs = getProgramLangs;
exports.getAllTasks = getAllTasks;
exports.getAllUsers = getAllUsers;
exports.getAllProgramlangs = getAllProgramlangs;
exports.getTask = getTask;
exports.getTestByTaskID = getTestByTaskID;
exports.getTop10Users = getTop10Users;
