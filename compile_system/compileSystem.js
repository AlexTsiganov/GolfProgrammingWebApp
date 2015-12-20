var events = require('events');
var fs = require('fs');
var exec = require("child_process").exec;
var eventEmitter = new events.EventEmitter();

function compileSystem(task, langInfo, solution, cb) {
    var PATH = "../tasks/" + task[0].ID_TASK + "/solutions/" + 
            solution[0].ID_SOLUTION + "/";
    var outputFile = PATH + "results.txt";
    var fileName = 'main';
    //console.log('langInfo: '+ langInfo);			
    if(langInfo[0].COMAND_TO_COMPILE != '') {
        if(langInfo[0].COMPILER_OPTIONS != '') {
            //console.log(langInfo[0].COMAND_TO_COMPILE + ' ' + PATH + fileName + 
            //        langInfo[0].EX_COMPILED_FILE + ' ' + 
            //        langInfo[0].COMPILER_OPTIONS + ' ' + PATH + fileName);
            exec(langInfo[0].COMAND_TO_COMPILE + ' ' + PATH + fileName + 
                    langInfo[0].EX_COMPILED_FILE + ' ' + 
                    langInfo[0].COMPILER_OPTIONS + ' ' + PATH + fileName + 
                    " 2>" + PATH + "compilelog.txt", function(err, stdout, stderr){
                        eventEmitter.emit('readyToExec', cb);
                    });				
        } else {
            //console.log('no options');
            exec(langInfo[0].COMAND_TO_COMPILE + " " + PATH + fileName + 
                    langInfo[0].EX_COMPILED_FILE + " 2>" + PATH + 
                    "compilelog.txt", function(err, stdout, stderr){
                        eventEmitter.emit('readyToExec', cb);
                    });	
        }					
    } else {
        //console.log('no compiler');
        eventEmitter.emit('readyToExec', cb);	
    }
}

eventEmitter.on('readyToExec', function(cb){
    cb('OK');
});

//example of use compileSystem function
/*compileSystem(1,tmp,1, function(rd){
	console.log(rd);
});*/
module.exports = compileSystem; 
