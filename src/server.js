'use strict';

const http 	= require('http');
const fs 	= require('fs');
const path 	= require('path');
const mime 	= require('mime');

var cache = {};

function send404(response) {
	response.writeHead(404, {'Content-Type': 'text/plain'});
	response.write('Error 404: resource not found.');
	response.end();
}

function sendFile(response, filePath, fileContents) {
	response.writeHead(
		200,
		{"Content-Type": mime.lookup(path.basename(filePath))}
	);
	response.end(fileContents);
}

function serveStatic(response, cache, absPath) {
	if (cache[absPath]) {
		sendFile(response, absPath, cache[absPath]);
	} else {
		fs.readFile(absPath, (err, data) => {
			if (err) {
				send404(response);
			} else {
				cache[absPath] = data;
				sendFile(response, absPath, data);
			}
		});
	}
}

var server = http.createServer( function(request, response) {
	var filePath = '';

	if (request.url === '/') {
		filePath = '../public/index.html';
	} else {
		filePath = '../public' + request.url;
	}

	var absPath = '../' + filePath;
	serveStatic(response, cache, absPath);
});


server.listen(3000, function() {
	console.log('Server listening on port 3000.');
});