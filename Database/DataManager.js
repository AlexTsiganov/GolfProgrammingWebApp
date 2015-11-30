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
});

var getAllTasks = function(cb) {
  connection.query("SELECT * FROM tasks", function(err, rows, fields)
  {
    console.log('Rows ', rows);
    cb(rows, err);
  });
};

var getProgramLangs = function(argument) {
  return [{'lang': 'c++'}, {'lang': 'Java'}, {'lang': 'Python'}];
};

var getTestByTaskID = function(taskID)
{
  // TODO: create sql table TESTS
  return [ {'in': '1 2', 'out': '3'}, {'in': '2 3', 'out': '5'}];
};

var getTask = function(id, cb) {
  connection.query("SELECT * FROM tasks WHERE id = ?", id, function(err, rows, fields)
  {
    rows[0]['tests'] = getTestByTaskID(id);
    cb(rows[0], err);
  });
};

exports.getProgramLangs = getProgramLangs;
exports.getAllTasks = getAllTasks;
exports.getTask = getTask;
exports.getTestByTaskID = getTestByTaskID;
