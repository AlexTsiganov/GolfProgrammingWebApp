var mysql = require('mysql');
var test_system = require('./testing');

var connection = mysql.createConnection({
    "host"     : "localhost",
    "user"     : "golf",
    "password" : "golf",
    "database" : "golf_programming"
});

connection.connect(function(err){
    if (err) {
        console.error('MySQL error connecting: ' + err.stack);
        return;
    }
    console.log('MySQL connected as id ' + connection.threadId);
}, charset='utf8', init_command='SET NAMES UTF8');


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

//////// example of using compiling / testing systems ////////

// TODO: get id of solution
// ...

// take info from DB, using solution_id (for example, 2)
getObjects(2, function(error, Test, Lang, Task, Solution) {
    
    // TODO: call compiling function
    // ...
    
    // call testing function
    test_system.testing(Lang, Task, Test, Solution);
});

// events handling for testing function
test_system.on('runtimeError', function(res) {
    console.log(res.id_solution);           // id of checked solution
    console.log(res.result);                // result of testing
    console.log(res.error_log);             // log of the error
    console.log(res.number_of_fail_test);   // number of failed test
});

test_system.on('testFailed', function(res) {
    console.log(res.id_solution);           // id of checked solution
    console.log(res.result);                // result of testing
    console.log(res.error_log);             // log of the error
    console.log(res.number_of_fail_test);   // number of failed test
});

test_system.on('success', function(res){
    console.log(res.id_solution);           // id of checked solution
    console.log(res.result);                // result of testing
    console.log(res.error_log);             // log of the error
    console.log(res.number_of_fail_test);   // number of failed test
});