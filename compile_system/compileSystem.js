var events = require('events');
var fs = require('fs');
var exec = require("child_process").exec;
var eventEmitter = new events.EventEmitter();

//var log = require('../libs/log.js')(module);

function compileSystem(task, langInfo, solution, cb) {
    var PATH = "../tasks/" + task[0].ID_TASK + "/solutions/" + 
            solution[0].ID_SOLUTION + "/";
    var outputFile = PATH + "results.txt";
    var fileName = 'main';
    //log.info('langInfo: '+ langInfo);			
    if(langInfo[0].COMAND_TO_COMPILE != '') {
        if(langInfo[0].COMPILER_OPTIONS != '') {
            //log.info(langInfo[0].COMAND_TO_COMPILE + ' ' + PATH + fileName + 
            //        langInfo[0].EX_COMPILED_FILE + ' ' + 
            //        langInfo[0].COMPILER_OPTIONS + ' ' + PATH + fileName);
            exec(langInfo[0].COMAND_TO_COMPILE + ' ' + PATH + fileName + 
                    langInfo[0].EX_COMPILED_FILE + ' ' + 
                    langInfo[0].COMPILER_OPTIONS + ' ' + PATH + fileName + 
                    " 2>" + PATH + "compilelog.txt", function(err, stdout, stderr){
                        eventEmitter.emit('readyToExec', cb);
                    });				
        } else {
            //log.info('no options');
            exec(langInfo[0].COMAND_TO_COMPILE + " " + PATH + fileName + 
                    langInfo[0].EX_COMPILED_FILE + " 2>" + PATH + 
                    "compilelog.txt", function(err, stdout, stderr){
                        eventEmitter.emit('readyToExec', cb);
                    });	
        }					
    } else {
        //log.info('no compiler');
        eventEmitter.emit('readyToExec', cb);	
    }
}

eventEmitter.on('readyToExec', function(cb){
    cb('OK');
});

//example of use compileSystem function
/*compileSystem(1,tmp,1, function(rd){
	log.info(rd);
});*/
module.exports = compileSystem; 
