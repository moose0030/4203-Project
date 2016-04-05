var app = require('http').createServer(handler)
, io = require('socket.io')(app)
, fs = require('fs')

var port = process.env.PORT || 1337;
app.listen(port)

//Storage of all data
var events = {};

var rpi_bt = [];
var rpi_wifi = [];
var wemo_switch = [];
var wemo_motion = [];
var android_location = [];
var android_sms = [];
var weather = [];

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
        console.log(obj);
        io.emit('_post',obj.type,obj);
        io.emit('_post',body);
        switch(obj.type){
            case "rpi-wifi":rpi_wifi.push(obj); break;
            case "rpi-bt": rpi_bt.push(obj); break;
            case "wemo-switch": wemo_switch.push(obj); break;
            case "wemo-motion": wemo_motion.push(obj); break;
            case "android-location": android_location.push(obj); break;
            case "android-sms":android_sms.push(obj); break;
        }
    });
  }
}

io.on('connection', function (socket) {
  
  io.emit("_post","bb",{name:"hi"});
  
  //socket.emit('_load', packageEvents());
});

console.log('Listening...');

function packageEvents(){
  events.rpi_bt = rpi_bt;
  console.log(events.rpi_bt);
  events.rpi_wifi = rpi_wifi;
  events.wemo_switch = wemo_switch;
  events.wemo_motion = wemo_motion;
  events.android_location = android_location;
  events.android_sms = android_sms;
  return events;
}
