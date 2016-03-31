var http = require('http')
var fs = require('fs');
var port = process.env.PORT || 1337;
var server = http.createServer( function(req, res) {

    console.dir(req.param);

    if (req.method == 'POST') {
        console.log("POST");
        var body = '';
        req.on('data', function (data) {
            body += data;
            console.log("Partial body: " + body);
        });
        req.on('end', function () {
            console.log("Body: " + body);
        });
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end('post received');
    }
    else
    {
        console.log("GET");
        //var html = '<html><body><form method="post" action="http://localhost:3000">Name: <input type="text" name="name" /><input type="submit" value="Submit" /></form></body>';
        //var html = fs.readFileSync('index.html');
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end('');
    }

}).listen(port);

console.log('Listening on ' + port);
