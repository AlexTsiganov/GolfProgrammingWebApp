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

exports.getAllTasks = function(cb) {
  connection.query("SELECT * FROM tasks", function(err, rows, fields)
  {
    console.log('Rows ', rows);
    cb(rows, err);
  });
};

exports.getTask = function(id, cb) {
  connection.query("SELECT * FROM tasks WHERE id = ?", id, function(err, rows, fields)
  {
    cb(rows[0], err);
  });
};
