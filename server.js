var app = require('http').createServer(handler)
, io = require('socket.io').listen(app)
, fs = require('fs')

var port = process.env.PORT || 1337;
app.listen(port)

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
      function (err, data) {
        if (err) {
          res.writeHead(500);
          return res.end('Error loading index.html');
      }
      res.writeHead(200);
      res.end(data);
  });

  if(req.method == 'POST'){
    var body = ''
    
    req.on('data', function (data) {
        body += data;
    });

    req.on('end', function () {
        console.log("Body: " + body)
        var json = body, obj = JSON.parse(json);  
        console.log(obj.type)
        console.log(obj)
        switch(obj.type){
            case "RPI-WIFI":io.emit('_post_rpi_wifi',obj);break;
            case "RPI-BT": io.emit('_post_rpi_bluetooth',obj);break;
            default:  io.emit('_post',body);
        }
    });
}
}




console.log('Listening...');
