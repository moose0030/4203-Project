// Shorthand for $( document ).ready()
$(function() {
    console.log( "ready!" );
});

var colours = ["#F73CFF","#0064FF","#00FF3C","#FFDF0D","#FF4400"];
var emptySimpleData = [];
var emptyComplexData = {
    labels: [],
    datasets: [
        {
            label: "My Fake Data",
            fillColor: "rgba(85, 228, 241,0.5)",
            strokeColor: "rgba(220,220,220,0.8)",
            highlightFill: "rgba(0, 218, 238,0.75)",
            highlightStroke: "rgba(220,220,220,1)",
            data: []
        }
    ]
};

///////////////////     HTML ELEMENTS       //////////////////////
var chart1 = document.getElementById("chart1").getContext("2d");
var chart2 = document.getElementById("chart2").getContext("2d");
var table = document.getElementById("data-table");

//////////////////    GLOBAL VARIABLES     //////////////////////

var wifiData = [];
var bluetoothData = [];

var switchData = [];
var motionData = [];

var smsData = [];
var locationData = [];

var leftGraphData = [];
var rightGraphData;

var updateInterval = 1000;
var currentView = "RPI-WIFI";


var locations = ["Living Room","Kitchen","Hallway","Front Door"];
var mostRecent = "";

var ch1 = new Chart(chart1).PolarArea(emptySimpleData);
var ch2 = new Chart(chart2).Bar(emptyComplexData);

///////////////////        DATA TYPES         ////////////////////

function accessPoint(ap,t) {
    this.signal = new Number(ap.signal);
    this.ssid = ap.ssid;
    this.channel = ap.channel;
    this.address = ap.address;
    this.time = new Date(t);
}

function bluetoothDevice(bd,t){
  this.name = bd.name;
  this.address = bd.address;
  this.time = new Date(t);
}

function wemoMotion(wm){
  this.type = wm.type;
  this.status = wm.status;
  this.location = locations[Math.floor((Math.random() * 4))];
  this.time = new Date(wm.time);
}

function wemoSwitch(ws){
  this.type = ws.type;
  this.mode = ws.mode;
  this.location = locations[Math.floor((Math.random() * 4))];
  this.time = new Date(ws.time);
}

function androidSMS(sms){
  this.type = sms.type;
  this.to =sms.to;
  this.time = new Date(sms.time);
}

function androidLocation(al){
  this.type = al.type;
  this.location =al.location;
  this.time = new Date(al.time);
}

function simpleData(value,label){
  this.value = value;
  this.label = label;
  this.color = colours[Math.floor((Math.random() * colours.length))];
}

function complexData(labels,l,d){
  this.labels = labels;
  this.datasets = [{
    label : l,
    fillColor: "rgba(85, 228, 241,0.5)",
    strokeColor: "rgba(220,220,220,0.8)",
    highlightFill: "rgba(0, 218, 238,0.75)",
    highlightStroke: "rgba(220,220,220,1)",
    data : d
  }];
}

///////////////////     EVENT LISTENERS       //////////////////////
$("#choose-speed li").on("click", function(){
  console.log($(this).text());
  updateInterval = new Number($(this).text());
});

var socket = io();
socket.on("_post", function(data){
  console.log(data);

  var obj = data;//JSON.parse(data);
  console.log(obj);
  console.log(obj.type + "<----obj   currentView---->" + currentView);
  loadData(obj);
  if(obj.type != currentView){
      notifyIcon(obj.type);
    }
});

socket.on("_load", function(data){
  $.each(data.rpi_wifi, function(){
    console.log(this);
    var obj = this;
    $.each(obj.devices, function(){
      var a = new accessPoint(JSON.parse(this),obj.time);
      wifiData.push(a);
    });
  });

  $.each(data.rpi_bt, function(){
    console.log(this);
    var obj = this;
    $.each(obj.devices, function(){
      var a = new bluetoothDevice(JSON.parse(this),obj.time);
      bluetoothData.push(a);
    });
  });

  $.each(data.wemo_switch, function(){
      console.log(this);
      var obj = this;
      var a = new wemoSwitch(obj);
      switchData.push(a);
  });

  $.each(data.wemo_motion, function(){
      console.log(this);
      var obj = this;
      var a = new wemoMotion(obj);
      motionData.push(a);
  });

  $.each(data.android_location, function(){
      console.log(this);
      var obj = this;
      var a = new androidLocation(obj);
      locationData.push(a);
  });
  
  $.each(data.android_sms, function(){
      console.log(this);
      var obj = this;
      var a = new androidSMS(obj);
      smsData.push(a);
  });
});


  

///////////////////       FUNCTIONS         //////////////////////
// add event listener to table
window.onload = function () {
  document.getElementById("ANDROID-SMS").addEventListener("click", anchorClick, false);
  document.getElementById("ANDROID-LOCATION").addEventListener("click", anchorClick, false);
  document.getElementById("RPI-WIFI").addEventListener("click", anchorClick, false);
  document.getElementById("RPI-BT").addEventListener("click", anchorClick, false);
  document.getElementById("WEMO-MOTION").addEventListener("click", anchorClick, false);
  document.getElementById("WEMO-SWITCH").addEventListener("click", anchorClick, false);
}

function anchorClick(event){
  console.log(event.target.id);
  switchThing(event.target.id);
}

function switchThing(option){
  console.log("Switch perspective");
  console.log(option);
    $( "#overview" ).children().removeClass();
    $( "#raspberrypi" ).children().removeClass();
    $( "#wemo" ).children().removeClass();
    $( "#android" ).children().removeClass();
    $("#" + option).addClass("active");
    currentView = option;

    if(option == mostRecent)
      clearNotification();

    switch(option){
      case "RPI-WIFI":loadWifiTable();break;
      case "RPI-BT":loadBluetoothTable();break;
      case "WEMO-SWITCH":loadSwitchTable();break;
      case "WEMO-MOTION":loadMotionTable();break;
      case "ANDROID-SMS":loadSMSTable();break;
      case "ANDROID-LOCATION":loadLocationTable();break;
    }
  }

function loadData(data){
  /*if($.isEmptyObject(data)){
    console.log("Empty data object");
    return;
  }*/
  console.log(data.type);
  switch(data.type){
    case "RPI-WIFI":      
      wifiData.length = 0;
      $.each(data.devices, function(){
        var a = new accessPoint(JSON.parse(this),data.time);
        wifiData.push(a);
      });

      if(data.type == currentView){
        loadWifiTable();
        $("#table-title").text("Wi-Fi Data");
      }
      break;

    case "RPI-BT": 
      $.each(data.devices, function(){
        var a = new bluetoothDevice(JSON.parse(this),data.time);
        bluetoothData.push(a);
      });

      if(data.type == currentView){
        loadBluetoothTable();
        $("#table-title").text("Bluetooth Data");
      }
      break;

    case "WEMO-SWITCH":
      var a = new wemoSwitch(data);
      if(switchData.length<20)
        switchData.push(a);
      else{
        switchData.pop();
        switchData.push(a);
      }

      if(data.type == currentView){
        loadSwitchTable();
        $("#table-title").text("WeMo Switch Data");
      }
      break;

    case "WEMO-MOTION":
      var a = new wemoMotion(data);
      if(motionData.length<20)
        motionData.push(a);
      else{
        motionData.pop();
        motionData.push(a);
      }
      if(data.type == currentView){
        loadMotionTable();
        $("#table-title").text("WeMo Motion Data");
      }
      break;

    case "ANDROID-LOCATION": 
      var a = new androidLocation(data);
      if(locationData.length<20)
        locationData.push(a);
      else{
        locationData.pop();
        locationData.push(a);
      }
      
      if(data.type == currentView){
        loadLocationTable();
        $("#table-title").text("Android Location Data");
      }
      break;

    case "ANDROID-SMS": 
      var a = new androidSMS(data);
      if(smsData.length<20)
        smsData.push(a);
      else{
        smsData.pop();
        smsData.push(a);
      }
      
      if(data.type == currentView){
        loadSMSTable();
        $("#table-title").text("Android SMS Data");
      }
      break;

    default: break;
  }
}
 
function setChartData(title1,title2,desc1,desc2){
  $("#chart1-desc").text(desc1);
  $("#chart2-desc").text(desc2);
  $("#chart1-title").text(title1);
  $("#chart2-title").text(title2);
}

function cleanTable(){
  $("#head-table td").remove(); 
  $("#body-table tr").remove(); 
  $("#body-table td").remove();
}

function loadWifiTable(){
  cleanTable();
  ch1.destroy();
  ch2.destroy();
  
  if(wifiData.length >0)
    setChartData("Signal Strength","Channels","Measured in dB(Smaller is better)","Wireless Channel of Each Access Point");
  else{
    setChartData("No data to load...","No data to load...","","");
    return;
  }
  
  $("#head-table tr").append("<td>SSID</td>")
  $("#head-table tr").append("<td>Signal Strength</td>")
  $("#head-table tr").append("<td>Channel</td>")
  $("#head-table tr").append("<td>Address</td>")
  $("#head-table tr").append("<td>Time</td>")
  leftGraphData.length = 0;
  var rows = "";
  var channels = [];
  var labels = [];

  $.each(wifiData, function(){
  console.log(this);

  leftGraphData.push(new simpleData(-1*new Number(this.signal),this.ssid));
  channels.push(this.channel);
  labels.push(this.ssid);
  rows += "<tr><td>" + this.ssid + "</td><td>" + this.signal + "</td><td>" + this.channel + "</td><td>" + this.address + "</td><td>" + this.time.toDateString() +" at "+ this.time.getHours() +":"+ this.time.getMinutes() +"</td></tr>";
  });
  rightGraphData = new complexData(labels,"Channels",channels);
  $( rows ).appendTo( "#body-table" );

  

  ch1 = new Chart(chart1).PolarArea(leftGraphData);
  ch2 = new Chart(chart2).Bar(rightGraphData);
}

function loadBluetoothTable(){
  cleanTable();
  ch1.destroy();
  ch2.destroy();
  
  if(bluetoothData.length > 0)
    setChartData("Number of Nearby Devices","","","");
  else{
    setChartData("No data to load...","No data to load...","","");
    return;
  }
  
  $("#head-table tr").append("<td>Device</td>")
  $("#head-table tr").append("<td>Address</td>")
  $("#head-table tr").append("<td>Time</td>")

  var rows = ""; 
  $.each(bluetoothData, function(){
    rows += "<tr><td>" + this.name + "</td><td>" +  this.address + "</td><td>" + this.time.toDateString() +" at "+ this.time.getHours() +":"+ this.time.getMinutes() + "</td></tr>";
  });

  rightGraphData = createTimeData(bluetoothData,"Bluetooth Connections");

  $( rows ).appendTo( "#body-table" );
 
  ch1 = new Chart(chart1).Bar(rightGraphData);  
}

function loadSwitchTable(){
  cleanTable();
  ch1.destroy();
  ch2.destroy();
  if(switchData.length >0)
    setChartData("Popular Events","Popular Time","Most Frequent Events","Most Frequent Periods of Time");
  else{
    setChartData("No data to load...","No data to load...","","");
    return;
  }
  
  $("#head-table tr").append("<td>Type</td>")
  $("#head-table tr").append("<td>Location</td>")
  $("#head-table tr").append("<td>Mode</td>")
  $("#head-table tr").append("<td>Time</td>")
  var rows = "";
  var on = 0;
  var off = 0;
  leftGraphData.length = 0;
  
  $.each(switchData, function(){
  console.log(this);
  if(this.mode == "on")
    on++;
  if(this.mode == "off")
    off++;
  rows += "<tr><td>" + this.type + "</td><td>" +   this.location + "</td><td>" +  this.mode + "</td><td>" + this.time.toDateString() +" at "+ this.time.getHours() +":"+ this.time.getMinutes()+ "</td></tr>";
  });

  leftGraphData.push(new simpleData(on,"on"));
  leftGraphData.push(new simpleData(off,"off"));
  rightGraphData = createTimeData(switchData,"Switch Time");
  $( rows ).appendTo( "#body-table" );
  
  
  ch1 = new Chart(chart1).Pie(leftGraphData);
  ch2 = new Chart(chart2).Bar(rightGraphData);

}

function loadMotionTable(){
  cleanTable();
  ch1.destroy();
  ch2.destroy();
  if(motionData.length >0)
    setChartData("Popular Locations","Popular Time","Most Frequent Locations","Most Frequent Periods of Time");
  else{
    setChartData("No data to load...","No data to load...","","");
    return;
  }
  $("#head-table tr").append("<td>Type</td>")
  $("#head-table tr").append("<td>Location</td>")
  $("#head-table tr").append("<td>Status</td>")
  $("#head-table tr").append("<td>Time</td>")

   var rows = "";
  $.each(motionData, function(){
  console.log(this);
  rows += "<tr><td>" + this.type + "</td><td>" +this.location + "</td><td>" + this.status + "</td><td>" + this.time.toDateString() +" at "+ this.time.getHours() +":"+ this.time.getMinutes()+ "</td></tr>";
  });

  $( rows ).appendTo( "#body-table" );
  

  leftGraphData = countProp(motionData,"location");
  rightGraphData = createTimeData(motionData,"Motion Time");

  ch1 = new Chart(chart1).Pie(leftGraphData);
  ch2 = new Chart(chart2).Line(rightGraphData);
}

function loadSMSTable(){
  cleanTable();
  ch1.destroy();
  ch2.destroy();
  if(smsData.length >0)
    setChartData("Popular People","Popular Time","Most Frequent People Texted To","Most Frequent Periods of Time");
  else{
    setChartData("No data to load...","No data to load...","","");
    return;
  }
  
  $("#head-table tr").append("<td>Type</td>")
  $("#head-table tr").append("<td>To</td>")
  $("#head-table tr").append("<td>Time</td>")

   var rows = "";
  $.each(smsData, function(){
  console.log(this);
  rows += "<tr><td>" + this.type + "</td><td>" +  this.to + "</td><td>" + this.time.toDateString() +" at "+ this.time.getHours() +":"+ this.time.getMinutes()+ "</td></tr>";
  });

  $( rows ).appendTo( "#body-table" );
  ch1.destroy();
  ch2.destroy();
  leftGraphData = countProp(smsData,"to");
  rightGraphData = createTimeData(smsData,"SMS Time");
  ch1 = new Chart(chart1).Pie(leftGraphData);
  ch2 = new Chart(chart2).Bar(rightGraphData);
}

function loadLocationTable(){
  cleanTable();
  ch1.destroy();
  ch2.destroy();
  if(locationData.length >0)
    setChartData("Popular Locations","Popular Time","Most Frequent Locations Visited","Most Frequent Periods of Time");
  else{
    setChartData("No data to load...","No data to load...","","");
    return;
  }
  
  $("#head-table tr").append("<td>Type</td>")
  $("#head-table tr").append("<td>Location</td>")
  $("#head-table tr").append("<td>Time</td>")

   var rows = "";
  $.each(locationData, function(){
  console.log(this);
  rows += "<tr><td>" + this.type + "</td><td>" +  this.location + "</td><td>" + this.time.toDateString() +" at "+ this.time.getHours() +":"+ this.time.getMinutes()+ "</td></tr>";
  });

  $( rows ).appendTo( "#body-table" );
  ch1.destroy();
  ch2.destroy();

  leftGraphData = countProp(locationData,"location");
  rightGraphData = createTimeData(locationData,"Location Time");

  ch1 = new Chart(chart1).Pie(leftGraphData);
  ch2 = new Chart(chart2).Line(rightGraphData);
}

function notifyIcon(datatype){
  $("#notification").html("New Data: " + datatype);
  mostRecent = datatype;
  console.log("it worked");
}

function clearNotification(){
  $("#notification").html("No new data to report.");
  mostRecent = "";
}

function createTimeData(data,title){
  var myMap ={};
  console.log(data.length);

  $.each(data, function(){
    if (typeof myMap[this.time.getMinutes()] === "undefined") {
      myMap[this.time.getMinutes()] = 1;
    }
    else{
      myMap[this.time.getMinutes()]++;
    }
  });

  var propValue;
  var values=[];
  var axis =[];
  for(var time in myMap) {
      count = myMap[time]
      values.push(count);
      axis.push(time);
      console.log(time,count);
  }
    return new complexData(axis,title,values);
}

function countProp(data,property){
  var myMap ={};
  console.log(data.length);

  $.each(data, function(){
    if (typeof myMap[this[property]] === "undefined") {
      myMap[this[property]] = 1;
    }
    else{
      myMap[this[property]]++;
    }
  });

  var propValue;
  var values=[];
  var axis =[];
  for(var prop in myMap) {
      count = myMap[prop]
      values.push(new simpleData(count,prop));
      console.log(prop,count);
  }
  console.log(values);
    return values;
}