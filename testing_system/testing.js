// required modules
var events = require('events');             // for events handling
var exec = require('child_process').exec;   // for execute external code
var fs = require('fs');                     // for work with files

// constructor of the class TestSystem
var TestSystem = function TestSystem(){
    events.EventEmitter.call(this);
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
 * @param {type} lang - data from table "PROGRAM_LANGUAGES".
 * @param {type} task - data from table "TASKS".
 * @param {type} test - data from table "TESTS".
 * @param {type} solution - data from table "SOLUTIONS".
 * @returns {undefined}
 */
TestSystem.prototype.testing = function testing(lang, task, test, solution) {
    
    console.log('Test: ', test);
    console.log('Lang: ', lang);
    console.log('Task: ', task);
    console.log('Solution: ', solution);
    
    // take solution
    this.solution = solution;
    
    // take filename
    this.code = './task/' + task[0].ID_TASK + '/solution/' + 
            solution[0].ID_SOLUTION + '/main' + lang[0].EX_EXECUTABLE_FILE;
    
    // take tests (input / output)
    this.tests = test;

    // take command to exec code
    this.exec_command = lang[0].COMAND_TO_EXEC;
    
    // take timelimit for current task
    this.timelimit = task.TIMELIMIT;
    
    // take number of tests
    this.n_tests = Object.keys(test).length;

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
    fs.writeFile('input.txt', this.tests[run-1].INPUT_DATA, function(){
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
    fs.writeFile('etalon.txt', this.tests[run-1].OUTPUT_DATA, function(){
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
                var res = {
                    id_solution: solution[0].ID_SOLUTION,
                    result: 'runtime error',
                    error_log: error,
                    number_of_fail_test: run
                };
                test_system.emit('runtimeError', res);
            }
        }
    );
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
            var res = {
                id_solution: solution[0].ID_SOLUTION,
                result: 'test failed',
                error_log: '',
                number_of_fail_test: run
            };
            test_system.emit('testFailed', res);
        }
    });
};
test_system.on('filesAreCompared', function(run){
    //console.log('files are compared');
    var solution = this.solution;
    // start next test
    run++;
    if(run <= this.n_tests)
        this.writeInput(run);
    else {
        var res = {
            id_solution: solution[0].ID_SOLUTION,
            result: 'success',
            error_log: '',
            number_of_fail_test: ''
        };
        test_system.emit('success', res);
    }
});

// export object of class to other module
module.exports = test_system;