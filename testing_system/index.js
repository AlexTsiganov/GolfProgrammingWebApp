var test_system = require('./testing');

// file with client's code
var workpath = '/home/adminuser/golf_app/';
var code = workpath + 'main';  

// call testing function
test_system.testing(1, code);

// events handling
test_system.on('runtimeError', function(err) {
    console.log(err.name);      // name of error
    console.log(err.message);   // description of error
    console.log(err.solution);  // id of solution
});

test_system.on('testFailed', function(err) {
    console.log(err.name);      // name of error
    console.log(err.message);   // description of error
    console.log(err.test);      // number of failed test
    console.log(err.solution);  // id of solution
});

test_system.on('success', function(){
    console.log('Tests completed');
});