process.stdin.on('readable', function() {
	var input = process.stdin.read().toString().split(' ');
	process.stdout.write(String(input[0]*1 + input[1]*1));
});
