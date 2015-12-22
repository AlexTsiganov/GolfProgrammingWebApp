var mysql = require('mysql');
var test_system = require('../testing_system/testing');
var compile_system = require('../compile_system/compileSystem');
var dataManager = require('./Database/DataManager');

var log = require('../libs/log.js')(module);

// TODO: get id of solution
var solution_id = 2;

// take info from DB, using solution_id
dataManager.getObjects(solution_id, function(error, Test, Lang, Task, Solution) {
    
    // call compiling function
    compile_system(Task, Lang, Solution, function(t){
        log.info(t);
        // call testing function
        test_system.testing(Lang, Task, Test, Solution);
    });
    
});

// events handling for testing function
test_system.on('runtimeError', function(res) {
    log.info(res.id_solution);           // id of checked solution
    log.info(res.result);                // result of testing
    log.info(res.error_log);             // log of the error
    log.info(res.number_of_fail_test);   // number of failed test
});

test_system.on('testFailed', function(res) {
    log.info(res.id_solution);           // id of checked solution
    log.info(res.result);                // result of testing
    log.info(res.error_log);             // log of the error
    log.info(res.number_of_fail_test);   // number of failed test
});

test_system.on('success', function(res){
    log.info(res.id_solution);           // id of checked solution
    log.info(res.result);                // result of testing
    log.info(res.error_log);             // log of the error
    log.info(res.number_of_fail_test);   // number of failed test
});