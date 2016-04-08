var app = require('http').createServer(handler)
, io = require('socket.io')(app)
, fs = require('fs')

var port = process.env.PORT || 1337;
app.listen(port)

//Storage of all data
var events = {};


// holds 20 events 
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
        //io.emit('_post',obj.type,obj);
        io.emit('_post',obj);
        switch(obj.type){
            case "RPI-WIFI":
            if(rpi_wifi.length< 20)
              rpi_wifi.push(obj);
            else{
              rpi_wifi.pop();
              rpi_wifi.push(obj);
            }break;
            case "RPI-BT":
            if(rpi_bt.length< 20)
              rpi_bt.push(obj);
            else{
              rpi_bt.pop();
              rpi_bt.push(obj);
            }break;
            case "WEMO-SWITCH":
            if(wemo_switch.length< 20)
              wemo_switch.push(obj);
            else{
              wemo_switch.pop();
              wemo_switch.push(obj);
            }break;
            case "WEMO-MOTION":
            if(wemo_motion.length< 20)
              wemo_motion.push(obj);
            else{
              wemo_motion.pop();
              wemo_motion.push(obj);
            }break;
            case "ANDROID-LOCATION":
            if(android_location.length< 20)
              android_location.push(obj);
            else{
              android_location.pop();
              android_location.push(obj);
            }break;
            case "ANDROID-SMS":
            if(android_sms.length< 20)
              android_sms.push(obj);
            else{
              android_sms.pop();
              android_sms.push(obj);
            }break;
        }
    });
  }
}

io.on('connection', function (socket) {
  socket.emit("_load",packageEvents());
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
