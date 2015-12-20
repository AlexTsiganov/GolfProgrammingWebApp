var mysql = require('mysql');
var test_system = require('../testing_system/testing');
var compile_system = require('../compile_system/compileSystem');
var dataManager = require('./Database/DataManager');

// TODO: get id of solution
var solution_id = 2;

// take info from DB, using solution_id
dataManager.getObjects(solution_id, function(error, Test, Lang, Task, Solution) {
    
    // call compiling function
    compile_system(Task, Lang, Solution, function(t){
        console.log(t);
        // call testing function
        test_system.testing(Lang, Task, Test, Solution);
    });
    
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