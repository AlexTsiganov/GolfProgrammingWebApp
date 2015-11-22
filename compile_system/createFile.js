//creation a new file. Name of file = fileName.extension, e.g. NewFile.cpp
var fs = require('fs');
function createFile (fileName, extension, data) {
	fs.writeFile(fileName+extension, data,function(err) {
	    if(err) throw err;
	});
}
exports.createFile = createFile;
