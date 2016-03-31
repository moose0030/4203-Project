var http = require('http')
var fs = require('fs');
var port = process.env.PORT || 1337;
var server = http.createServer( function(req, res) {
res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello World\n');
}).listen(port);

console.log('Listening on ' + port);
