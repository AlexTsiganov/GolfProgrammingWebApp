var selects = require('../Database/DataManager');
var events = require('events');
var createFile = require("./createFile");
var fs = require('fs');
var exec = require("child_process").exec;
var eventEmitter = new events.EventEmitter();
var PATH = "./tests/";

var fileName = 'Main';

var execFileName=PATH+"Main";
var outputFile = "./results.txt";
//запросы к базе данных, id - идентификатор решения, language_id - идентификатор языка
function compileSystem(id, language_id) {
	var progText = selects.getProgText(id);
	eventEmitter.emit('text', progText);
	var ext = selects.getExt(id);
	eventEmitter.emit('ext', ext);
	var compiler = selects.getPathToCompiler(language_id);
	eventEmitter.emit('compiler', compiler);
	var execCommand = selects.getExecCommand(language_id);
	eventEmitter.emit('execCommand', execCommand);
	var options = selects.getOptions(language_id);
	eventEmitter.emit('options', options);
}


//когда и текст решения прочитан из БД и расширение, то создается файл на сервере
eventEmitter.on('text', function(progText){
	console.log(progText)
	eventEmitter.on('ext', function(ext){
		console.log('ext: '+ext);
		fs.writeFile(fileName+ext, progText,function(err) {
			if(err) console.log('can`t create file');			
			else
			{
				console.log('file created');
			}

		});
		eventEmitter.emit('fileCreated', ext);
		
	});
});
//когда файл создаен, и прочитан компилятор из БД, то компилируется
eventEmitter.on('fileCreated',function(ext){
	console.log('ext: '+ext);
	eventEmitter.on('compiler', function(compiler){
		console.log('compiler: '+compiler);
		if (compiler!=""){
			eventEmitter.on('options', function(options){
				if(options!=''){
					console.log(options);
					exec(compiler+' '+PATH+fileName+ext+' '+options+' '+execFileName+' 2>log.txt');				
				}	
				else {
					console.log('no options');
					exec(compiler+" "+PATH+fileName+ext+' 2> log.txt');
				}		
			});
			
		}
		else {
			console.log('no compiler');
			execFileName = execFileName+ext;	
		}
		eventEmitter.emit('readyToExec',execFileName);
	});
});

//Когда готово к исполнению, то запускается
eventEmitter.on('readyToExec', function(execFileName){
	console.log('execFileName: '+execFileName);
	eventEmitter.on('execCommand', function(execCommand){
		console.log('execCommand: '+execCommand);
		exec(execCommand+" "+execFileName+" >"+outputFile);
	});
});

 compileSystem(1,3);
//exports compileSystem = compileSystem;
