var selects = require('./selects');
var events = require('events');
var createFile = require("./createFile");
var exec = require("child_process").exec;
var eventEmitter = new events.EventEmitter();
var PATH = "/home/nikita/ProgrammingGolf/tests/";

var fileName = 'Main';
var progText;
var ext;
var lang_id;
var compilator;
var options;
var execCommand;
var execFileName=PATH+"Main";
var outputFile = "/home/results.txt
//запросы к базе данных, id - идентификатор решения, language_id - идентификатор языка
function compileSystem(id, language_id) {
	lang_id=language_id;
	selects.selectText(id, function(progText){
		eventEmitter.emit('text', progText);
	});
	selects.selectEx(id, function(ex){
		eventEmitter.emit('ex', ex);
	});
	selects.selectPath(lang_id, function(compilator){
		eventEmitter.emit('compilator', compilator);
	});
	selects.selectExecCommand(lang_id, function(execCommand){
		eventEmitter.emit('execCommand', execCommand);
	});
	selects.selectExecCommand(lang_id, function(options){
		eventEmitter.emit('options', options);
	});
}
//когда и текст решения прочитан из БД и расширение, то создается файл на сервере
eventEmitter.on('text', function(progText){
	eventEmitter.on('ex', function(ex){
		ext=ex;
		createFile.createFile(PATH+fileName,ex,progText);
		eventEmitter.emit('fileCreated', lang_id);
	});
});
//когда файл создаен, и прочитан компилятор из БД, то компилируется
eventEmitter.on('fileCreated',function(lang_id){
	eventEmitter.on('compilator', function(compilator){
		console.log(compilator);
		if (compilator!=""){
			eventEmitter.on('options', function(options){
				if(options!=''){
					exec(compilator+' '+PATH+fileName+ext+' '+options+' '+execFileName+' 2>log.txt');				
				}	
				else {
					exec(compilator+" "+PATH+fileName+ext+' 2> log.txt');
				}		
			});
			
		}
		else {
			execFileName = execFileName+ext;	
		}
		eventEmitter.emit('readyToExec',execFileName);
	});
});

//Когда готово к исполнению, то запускается
eventEmitter.on('readyToExec', function(execFileName){
	eventEmitter.on('execCommand', function(execCommand){
		exec(execCommand+" "+execFileName+" >"+outputFile);
	});
});


exports compileSystem = compileSystem;
