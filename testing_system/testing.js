// required modules
var db = require('./database');             // connect to "virtual" database
var events = require('events');             // for events handling
var exec = require('child_process').exec;   // for execute external code
var fs = require('fs');                     // for work with files

// constructor of the class TestSystem
var TestSystem = function TestSystem(){
    events.EventEmitter.call(this);
	this.n_tests = 3;
};
require('util').inherits(TestSystem, events.EventEmitter);

// fields of the class
TestSystem.code;        // executable file
TestSystem.n_tests;     // number of test cases
TestSystem.tests;       // test cases
TestSystem.exec_command;// command to execute client's code
TestSystem.timelimit;   // timelimit for current task
TestSystem.solution;    // solution ID from database

// object of class for events handling
var test_system = new TestSystem();

/**
 * Main function for testing client's code.
 * This function starts the test - calls the function writeInput().
 * @param {type} solution - solution ID from database.
 * @param {type} filename - full name (with path) of the file with code.
 * @returns {undefined}
 */
TestSystem.prototype.testing = function testing(solution, filename) {
    
    // save solution ID
    this.solution = solution;
    
    // save filename
    this.code = filename;
    
    // select from DB
    this.tests = [
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
    this.exec_command = db.langs[0].exec_command;
    this.timelimit = db.tasks[0].timelimit;
    
    // start test with 1st test case
    this.writeInput(1);

};

/**
 * Function for write input test in file. Completion of the function generates 
 * the event 'inputIsWrited'. This event calls the function writeEtalon().
 * @param {type} run - number of current test case (1, 2, 3, ...).
 * @returns {undefined}
 */
TestSystem.prototype.writeInput = function writeInput(run) {
    fs.writeFile('input.txt', this.tests[run-1].input, function(){
	test_system.emit('inputIsWrited', run);
    });
};
test_system.on('inputIsWrited', function(run){
    //console.log('input.txt is writed');
    this.writeEtalon(run);
});

/**
 * Function for write output test in file. Completion of the function generates 
 * the event 'etalonIsWrited'. This event calls the function execCode().
 * @param {type} run - number of current test case (1, 2, 3, ...).
 * @returns {undefined}
 */
TestSystem.prototype.writeEtalon = function(run) {
    fs.writeFile('etalon.txt', this.tests[run-1].output, function(){
	test_system.emit('etalonIsWrited', run);
    });
};
test_system.on('etalonIsWrited', function(run){
    //console.log('etalon.txt is writed');
    this.execCode(run);
});

/**
 * Function for execute client's code. If code isn't executed,
 * function generates error event 'runtimeError'. Else function generates
 * the event 'codeIsExecuted' and calls the function compareFiles().
 * @param {type} run - number of current test case (1, 2, 3, ...).
 * @returns {undefined}
 */
TestSystem.prototype.execCode = function(run) {
    var solution = this.solution;
    exec(this.exec_command + ' ' + this.code + ' < input.txt > output.txt',
    function(error, stdout, stderr){
        //console.log('error = ' + error + '\n');
        //console.log('stdout = ' + stdout + '\n');
        //console.log('strerr = ' + stderr + '\n');
        if(stderr === '')
            test_system.emit('codeIsExecuted', run);
        else {
            var error = new Error('runtime error');
            error.name = 'Runtime Error';
            error.message = 'Solution #' + solution + ' is incorrect.';
            error.solution = solution;
            test_system.emit('runtimeError', error);
        }
    });
};
test_system.on('codeIsExecuted', function(run){
    //console.log('code is executed');
    this.compareFiles(run);
});

/**
 * Function for compare result of client's code and etalon data. 
 * If files are not the same, then function generates error event 'testFailed'.
 * Else function generates the event 'filesAreCompared' and starts new test.
 * @param {type} run - number of current test case (1, 2, 3, ...).
 * @returns {undefined}
 */
TestSystem.prototype.compareFiles = function(run) {
    var solution = this.solution;
    exec('diff output.txt etalon.txt',
    function(error, stdout, stderr){
        //console.log('error = ' + error + '\n');
        //console.log('stdout = ' + stdout + '\n');
        //console.log('strerr = ' + stderr + '\n');
        if(stdout === '')
            test_system.emit('filesAreCompared', run);
        else {
            var error = new Error('test failed');
            error.name = 'Test Failed';
            error.message = 'Test #' + run + 
                    ' for solution #' + solution + ' is fail.';
            error.test = run;
            error.solution = solution;
            test_system.emit('testFailed', error);
        }
    });
};
test_system.on('filesAreCompared', function(run){
    //console.log('files are compared');
    // start next test
    run++;
    if(run <= this.n_tests)
        this.writeInput(run);
    else
        test_system.emit('success');
});

// export object of class to other module
module.exports = test_system;