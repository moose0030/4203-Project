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
        var json = body, obj = JSON.parse(json);  
    
        switch(obj.type){
            case "RPI-WIFI":console.log(obj.type);io.emit('_post_rpi_wifi',obj); break;
            case "RPI-BT": console.log(obj.type);io.emit('_post_rpi_bluetooth',obj); break;
            case "WEMO-SWITCH": console.log(obj.type);io.emit('_post_wemo_switch',obj); break;
            case "WEMO-MOTION":console.log(obj.type);io.emit('_post_wemo_motion',obj); break;
            default:  console.log(obj.type);io.emit('_post',body);
        }
    });
}
}

console.log('Listening...');
