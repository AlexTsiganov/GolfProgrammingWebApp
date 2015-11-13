// connect to "virtual" database
var db = require('./database');

// for events handling
var events = require('events');
var eventEmitter = new events.EventEmitter();

// for execute external code
var exec = require('child_process').exec;

// for work with files
var fs = require('fs');
var workpath = '/home/adminuser/golf_app/'; // !!!!!!
var input = workpath + 'input.txt';
var output = workpath + 'output.txt';
var etalon = workpath + 'etalon.txt';
var code = workpath + 'main';  // executable file

// status of solution (testing, runtime error, exceeding time limit, OK)
var status;

// number of test cases
var n_tests = 3;

// information from database
var tests;
var exec_command;
var timelimit;

/**
 * Main function for testing client's code.
 * @param solution - solution ID from database.
 * @param filename - full name (with path) of the file with code.
 * @returns {undefined}
 */
function testing(solution, filename) {

    // status update
    status = 'testing';
    
    // save filename
    code = filename;
    
    // select from DB
    tests = [
        {
            input: db.tests[0].input_data,
            output: db.tests[0].output_data
        },
        {
            input: db.tests[1].input_data,
            output: db.tests[1].output_data
        },
        {
            input: db.tests[2].input_data,
            output: db.tests[2].output_data
        }
    ];
    exec_command = db.langs[0].exec_command;
    timelimit = db.tasks[0].timelimit;
    
    // start test with 1st test case
    writeInput(1);

}

/**
 * Function for write input test in file. Completion of the function generates 
 * the event. This event triggers the function writeEtalon().
 * @param run - number of current test case (1, 2, 3, ...).
 * @returns {undefined}
 */
var writeInput = function(run) {
    fs.writeFile(input, tests[run-1].input, function(){
	eventEmitter.emit('inputIsWrited', run);
    });
};
eventEmitter.on('inputIsWrited', function(run){
    console.log('input.txt is writed');
    writeEtalon(run);
});

/**
 * Function for write output test in file. Completion of the function generates 
 * the event. This event triggers the function execCode().
 * @param run - number of current test case (1, 2, 3, ...).
 * @returns {undefined}
 */
var writeEtalon = function(run) {
    fs.writeFile(etalon, tests[run-1].output, function(){
	eventEmitter.emit('etalonIsWrited', run);
    });
};
eventEmitter.on('etalonIsWrited', function(run){
    console.log('etalon.txt is writed');
    execCode(run);
});

/**
 * Function for write input test in file. Completion of the function generates 
 * the event. This event triggers the function compareFiles().
 * @param run - number of current test case (1, 2, 3, ...).
 * @returns {undefined}
 */
var execCode = function(run) {
    exec(exec_command + ' ' + code + ' < ' + input + ' > ' + output,
    function(error, stdout, stderr){
        //console.log('error = ' + error + '\n');
        //console.log('stdout = ' + stdout + '\n');
        //console.log('strerr = ' + stderr + '\n');
	eventEmitter.emit('codeIsExecuted', run);
    });
};
eventEmitter.on('codeIsExecuted', function(run){
    console.log('code is executed');
    compareFiles(run);
});

/**
 * Function for compare result of client's code and etalon data. Completion of 
 * the function generates the event. This event display the result of testing
 * and start new test.
 * @param run - number of current test case (1, 2, 3, ...).
 * @returns {undefined}
 */
var compareFiles = function(run) {
    exec('diff ' + output + ' ' + etalon,
    function(error, stdout, stderr){
        //console.log('error = ' + error + '\n');
        //console.log('stdout = ' + stdout + '\n');
        //console.log('strerr = ' + stderr + '\n');
	eventEmitter.emit('filesAreCompared', stdout, run);
    });
};
eventEmitter.on('filesAreCompared', function(stdout, run){
    console.log('files are compared');
    console.log('result:');
    if(stdout === '') {
        console.log('Test #' + run + ' passed!');
        status = 'Test #' + run + ' passed!';
        // start next test
        run++;
        if(run <= n_tests)
            writeInput(run);
    }
    else {
        console.log('Test #' + run + ' failed!');
        status = 'Test #' + run + ' failed!';
    }
    
});

// testing this JS code
testing(1, code);
