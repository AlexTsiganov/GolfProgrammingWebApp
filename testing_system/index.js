var test_system = require('./testing');

// file with client's code
var code = './main';

// select * from PROGRAM_LANGUAGES
var langs = {
    ID_PROGRAM_LANGUAGE: 1,
    LANGUAGE_NAME: 'C++',
    PATH: '',
    EX_ORIGINAL_FILE: 'cpp',
    EX_EXECUTABLE_FILE: 'exe',
    COMPILER_OPTIONS: '-o',
    COMAND_TO_EXEC: ''
};

// select * from TASKS
var tasks = {
    ID_TASK: 1,
    TASKNAME: 'taskname',
    TEXT: 'tasktext',
    TASK_DATE: '2015-12-01',
    TIMELIMIT: 30
};

// select * from TESTS
var tests = [
    {
        ID_TEST: 1,
        ID_TASK: 1,
        INPUT_DATA: '4 6',
        OUTPUT_DATA: '10',
        VISIBLE: 0
    },{
        ID_TEST: 2,
        ID_TASK: 1,
        INPUT_DATA: '423 577',
        OUTPUT_DATA: '1000',
        VISIBLE: 0
    },{
        ID_TEST: 3,
        ID_TASK: 1,
        INPUT_DATA: '17 33',
        OUTPUT_DATA: '50',
        VISIBLE: 0
    }
];

// select * from SOLUTIONS
var solutions = {
    ID_SOLUTION: 1,
    SOLUTION_TASK_ID: 1,
    SOLUTION_USER_ID: 1,
    SOLUTION_DATE: '2015-12-01',
    PROGRAM_LANGUAGE: 1,
    TEXT: '',
    LENGTH_CODE: 1,
    STATUS: ''
};

// call testing function
test_system.testing(code, langs, tasks, tests, solutions);

// events handling
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