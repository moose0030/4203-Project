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
if(req.url.indexOf('.html') != -1){ //req.url has the pathname, check if it conatins '.html'
  fs.readFile(__dirname + '/index.html',
    function (err, data) {
      if (err) {
        res.writeHead(500);
        return res.end('Error loading index.html');
      }
      res.writeHead(200);
      res.end(data);
      console.log("Wrote HTML");
    });


}

    else if(req.url.indexOf('.js') != -1){ //req.url has the pathname, check if it conatins '.js'

      fs.readFile(__dirname + '/app.js', function (err, data) {
        if (err) console.log(err);
        res.writeHead(200, {'Content-Type': 'text/javascript'});
        res.write(data);
        res.end();
        console.log("Wrote JS");
      });

  }

    else if(req.url.indexOf('.css') != -1){ //req.url has the pathname, check if it conatins '.css'

      fs.readFile(__dirname + '/style.css', function (err, data) {
        if (err) console.log(err);
        res.writeHead(200, {'Content-Type': 'text/css'});
        res.write(data);
        res.end();
        console.log("Wrote CSS");
      });
  }
  else{
    fs.readFile(__dirname + '/index.html',
      function (err, data) {
        if (err) {
          res.writeHead(500);
          return res.end('Error loading index.html');
        }
        res.writeHead(200);
        res.end(data);
        console.log("Wrote HTML");
      });
  }
  

  if(req.method == 'POST'){
    var body = ''
    
    req.on('data', function (data) {
      body += data;
    });

    req.on('end', function () {
      var json = body, obj = JSON.parse(json);  
      console.log(obj);
      obj.time = new Date();
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
          return;
        }break;
      }
      console.log(obj);
      io.emit('_post',obj);
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
