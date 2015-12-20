var selects = require('../Database/DataManager');
//var selects = require('./tmp');
var events = require('events');
var createFile = require("./createFile");
var fs = require('fs');
var exec = require("child_process").exec;
var eventEmitter = new events.EventEmitter();




/*Example of langInfo object*/
/*var tmp = new Object();
tmp.COMAND_TO_COMPILE="gcc";
tmp.EX_COMPILED_FILE=".c";
tmp.COMPILER_OPTIONS="-o";
*/
function compileSystem(taskid, langInfo, solution_id, cb) {
	var PATH = "../tasks/"+taskid+"/solutions/"+solution_id+"/";
	var outputFile = PATH+"results.txt";
	var fileName = 'main';
	console.log('langInfo: '+langInfo);			
	if (langInfo.COMAND_TO_COMPILE!=""){
		if(langInfo.COMPILER_OPTIONS!=''){
			console.log(langInfo.COMAND_TO_COMPILE+' '+PATH+fileName+langInfo.EX_COMPILED_FILE+' '+langInfo.COMPILER_OPTIONS+' '+PATH+fileName);
			exec(langInfo.COMAND_TO_COMPILE+' '+PATH+fileName+langInfo.EX_COMPILED_FILE+' '+langInfo.COMPILER_OPTIONS+' '+PATH+fileName+" 2>"+PATH+"compilelog.txt", 					function (err, stdout,stderr){
				eventEmitter.emit('readyToExec',cb);
			});				
		}	
		else {
			console.log('no options');
			exec(langInfo.COMAND_TO_COMPILE+" "+PATH+fileName+langInfo.EX_COMPILED_FILE+" 2>"+PATH+"compilelog.txt",function (err, stdout,stderr){
				eventEmitter.emit('readyToExec',cb);
			});	
		}					
	}
	else {
		console.log('no compiler');
		eventEmitter.emit('readyToExec',cb);	
	}
	
}

eventEmitter.on('readyToExec', function(cb){
	cb('I`m ready1');
});
	
	


//example of use compileSystem function
/*compileSystem(1,tmp,1, function(rd){
	console.log(rd);
});*/
exports compileSystem = compileSystem;
