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
    
        switch(obj.type){
            case "RPI-WIFI":console.log(obj.type);io.emit('_post_rpi_wifi',obj); rpi_wifi.push(body); break;
            case "RPI-BT": console.log(obj.type);io.emit('_post_rpi_bluetooth',obj); rpi_bt.push(body); break;
            case "WEMO-SWITCH": console.log(obj.type);io.emit('_post_wemo_switch',obj); wemo_switch.push(body); break;
            case "WEMO-MOTION":console.log(obj.type);io.emit('_post_wemo_motion',obj); wemo_motion.push(body); break;
            case "ANDROID-LOCATION":console.log(obj.type);io.emit('_post_android_location',obj); android_location.push(body); break;
            case "ANDROID-SMS":console.log(obj.type);io.emit('_post_android_sms',obj); android_sms.push(body); break;
            default:  console.log(obj.type);io.emit('_post',body);
        }
    });
  }
}

io.on('connection', function (socket) {
  console.log("Connected");
  socket.emit('_load', packageEvents());
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
