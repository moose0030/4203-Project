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
    //WEATHER SENSOR
    var num = 0;
    
    /*switch(num){
        case WEATHER:break;
        case RPI-WIFI:break;
        case RPI-BT:break;
        case WEMO-SWICTH:break;
        case WEMO-MOTION:break;
    }*/
    //RPi WiFi

    //RPi Bluetooth

    //WeMo Switch

    //WeMo Motion Sensor
    var body = ''

    console.log(req.method + 'It was a post...')
    
    req.on('data', function (data) {
        body += data;
        console.log("Partial body: " + body);
    });

    req.on('end', function () {
        console.log("Body: " + body)
        if(body.type == 'RPI-WIFI')
            io.emit('_post_rpi_wifi',body)
        else
            io.emit('_post',body);
   });

}
}




console.log('Listening...');
