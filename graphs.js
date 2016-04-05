///////////////////     EXAMPLE DATA        //////////////////////
var colours = ['#FF9058','#FFD958','#53F3BF','#766AF4'];
var colours2= ['#EBB802','#4DCD01','#D70133','#2617A3'];
var data = [
    {
      value: 25,
      label: 'Java',
      color: colours[0]
    },
    {
      value: 10,
      label: 'Scala',
      color: colours[1]
    },
    {
      value: 30,
      label: 'PHP',
      color: colours[2]
    },
    {
      value : 35,
      label: 'HTML',
      color: colours[3]
    },
    {
      value : 35,
      label: 'HTML',
      color: colours2[0]
    },{
      value : 35,
      label: 'HTML',
      color: colours2[1]
    }
    ];
var wifiTestData=[
{
      value: 0.017,
      label: 'Basement',
      color: colours[0]
    },
    {
      value: 0.022,
      label: 'Extend2.4',
      color: colours[1]
    },
    {
      value: 0.012,
      label: 'Bell050',
      color: colours[2]
    }
];
 
var wifiTestData2 = {
    labels: ["11"],
    datasets: [
        {
            label: "Channels",
            fillColor: "rgba(85, 228, 241,0.5)",
            strokeColor: "rgba(220,220,220,0.8)",
            highlightFill: "rgba(0, 218, 238,0.75)",
            highlightStroke: "rgba(220,220,220,1)",
            data: [3]
        }
    ]
};

var data2 = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
        {
            label: "My First dataset",
            fillColor: "rgba(85, 228, 241,0.5)",
            strokeColor: "rgba(220,220,220,0.8)",
            highlightFill: "rgba(0, 218, 238,0.75)",
            highlightStroke: "rgba(220,220,220,1)",
            data: [65, 59, 80, 81, 56, 55, 40]
        }
    ]
};

var testJson = {
  json: {
    devices: [
      {signal : "-59", ssid: "Basement", channel: "11", address: "00:FC:8D:06:AD:58"}, 
      {signal : "-45", ssid: "Extend 2.4", channel: "11", address: "00:90:A9:AD:CA:3B"}, 
      {signal : "-87", ssid: "BELL050", channel: "11", address: "D8:6C:E9:2A:66:CD"}
    ], 
    type: "RPI-WIFI"
  }, 
  origin: "99.246.104.179", 
  url: "http://httpbin.org/post"
}

var testJson2 = {
  json: {
    devices: [
      {name: "G4", address: "78:F8:82:4A:24:69"},
      {name: "G4", address: "78:F8:82:4A:24:69"},
      {name: "G4", address: "78:F8:82:4A:24:69"},
      {name: "G4", address: "78:F8:82:4A:24:69"},
      {name: "G4", address: "78:F8:82:4A:24:69"}
    ]
  }
}

var testJson3 = {
  json:{
    devices:[
      {type : "WEMO-MOTION", status : "Just sensed motion"},
      {type : "WEMO-MOTION", status : "Just sensed motion"},
      {type : "WEMO-MOTION", status : "Just sensed motion"},
      {type : "WEMO-MOTION", status : "Just sensed motion"}
    ]
  }
}

var testJson4 = {
  json:{
    devices:[   
      {type : "WEMO-SWITCH", mode : "on"},
      {type : "WEMO-SWITCH", mode : "on"},
      {type : "WEMO-SWITCH", mode : "on"},
      {type : "WEMO-SWITCH", mode : "on"}
    ]
  }
}

var testJson5 = {
  json:{
    devices:[   
      {type : "ANDROID-LOCATION", location : "Home"},
      {type : "ANDROID-LOCATION", location : "Home"},
      {type : "ANDROID-LOCATION", location : "Home"},
      {type : "ANDROID-LOCATION", location : "Home"},
    ]
  }
}

var testJson6 = {
  json:{
    devices:[   
      {type : "ANDROID-SMS", from : "Garrett Duff"},
      {type : "ANDROID-SMS", from : "Garrett Duff"},
      {type : "ANDROID-SMS", from : "Garrett Duff"},
      {type : "ANDROID-SMS", from : "Garrett Duff"},
    ]
  }
}

function accessPoint(ap) {
    this.signal = new Number(ap.signal);
    console.log(this.signal);
    this.ssid = ap.ssid;
    this.channel = ap.channel;
    this.address = ap.address;
}

function bluetoothDevive(bd){
  this.name = bd.name;
  this.address = bd.address;
}

function wemoMotion(wm){
  this.type = wm.type;
  this.mode = wm.mode
}

function wemoSwitch(ws){
  this.type = ws.type;
  this.status =ws.status;
}

function androidSMS(sms){
  this.type = sms.type;
  this.from =sms.from;
}

function androidLocation(al){
  this.type = al.type;
  this.location =al.location;
}

var ap = new accessPoint(testJson.json.devices[0]);

///////////////////     HTML ELEMENTS       //////////////////////
var chart1 = document.getElementById('chart1').getContext("2d");
var chart2 = document.getElementById('chart2').getContext("2d");



var table = document.getElementById('data-table');

//////////////////         DATA          /////////////////////////
var wifiData = [];
var bluetoothData = [];

var switchData = [];
var motionData = [];

var smsData = [];
var loactionData = [];

var updateInterval = 1000;

var ch1= new Chart(chart1).PolarArea(data);
var ch2 = new Chart(chart2).Bar(data2);


///////////////////     EVENT LISTENERS       //////////////////////
$('#choose-speed li').on('click', function(){
  console.log($(this).text());
  updateInterval = new Number($(this).text());
});

var socket = io();
  /*socket.on('_post', function(datatype, data){
    if(datatype == currentView){
      loadData(datatype, data);
    }
  });

  socket.on('_load', function(data){
    
  });
*/
///////////////////       FUNCTIONS         //////////////////////

/*var myFunction = function(){
    clearInterval(interval);
    interval = setInterval(myFunction, updateInterval);
    alert("Hi");
}
  var interval = setInterval(myFunction, updateInterval);
*/
function switchThing(option){
    //this
    $( "#overview" ).children().removeClass();
    $( "#raspberrypi" ).children().removeClass();
    $( "#wemo" ).children().removeClass();
    $( "#android" ).children().removeClass();
    $('#' + option).addClass("active");
    loadData(option,0);

    //loadBluetoothTable();
  }

function loadData(datatype, data){
  /*if($.isEmptyObject(data)){
    //alert("We don't have any data of that kind: " + datatype);
    console.log("Empty data object");
    return;
  }*/
    console.log(datatype);
  switch(datatype){
    case "rpi-wifi":      
        //data.rpi_wifi.forEach(iterateWifi);
        loadWifiTable();
        setChartData("Signal Strength","Channels","Measured in dB","Number of Access Points/Channel");
        $('#table-title').text("Wi-Fi Data");
        //load view data with wifi related data
        //load into graphs and table
        //update view
        break;
        case "rpi-bt": 
        //load view data with wifi related data
        //data.rpi_bt.forEach(iterateBluetooth);
        loadBluetoothTable();
        setChartData("","","","");
        $('#table-title').text("Bluetooth Data");
        //load into graphs and table
        //update view
        break;
        case "wemo-switch":  
        //load view data with wifi related data
        loadSwitchTable();
        setChartData("Popular Events","Popular Time","Most Frequent Events","Most Frequent Periods of Time");
        $('#table-title').text("WeMo Switch Data");
        //load into graphs and table
        //update view
        break;
        case "wemo-motion": 
        //load view data with wifi related data
        loadMotionTable();
        setChartData("Popular Events","Popular Time","Most Frequent Events","Most Frequent Periods of Time");
        $('#table-title').text("WeMo Motion Data");
        //load into graphs and table
        //update view
        break;
        case "android-location": 
        //load view data with wifi related data
        loadLocationTable();
        setChartData("Popular Locations","Popular Time","Most Frequent Locations","Most Frequent Periods of Time");
        $('#table-title').text("Android Location Data");
        //load into graphs and table
        //update view
        break;
        case "android-sms": 
        //load view data with wifi related data
        loadSMSTable();
        loadChartData()
        setChartData("Popular People","Popular Time","Most Frequent People","Most Frequent Periods of Time");
        $('#table-title').text("Android SMS Data");
        //load into graphs and table
        //update view
        break;
        default: break;
      }
    }
 
  function iterateWifi(element, index, array) {
    var ap = new accessPoint(element);
    wifiData.push(ap);
    console.log(ap);
  }

  function iterateBluetooth(element, index, array) {
    var bd = new bluetoothDevive(element);
    bluetoothData.push(bd);
    console.log(bd);
  }

  function setChartData(title1,title2,desc1,desc2){
    $('#chart1-desc').text(desc1);
    $('#chart2-desc').text(desc2);
    $('#chart1-title').text(title1);
    $('#chart2-title').text(title2);
  }

  function cleanTable(){
    $("#head-table td").remove(); 
    $("#body-table tr").remove(); 
    $("#body-table td").remove();
  }

  function loadWifiTable(){
    cleanTable();
    $('#head-table tr').append('<td>SSID</td>')
    $('#head-table tr').append('<td>Signal Strength</td>')
    $('#head-table tr').append('<td>Channel</td>')
    $('#head-table tr').append('<td>Address</td>')
  
    var rows = "";
    $.each(testJson.json.devices, function(){
    console.log(this);
    rows += "<tr><td>" + this.ssid + "</td><td>" + this.signal + "</td><td>" + this.channel + "</td><td>" + this.address + "</td></tr>";
    });

    $( rows ).appendTo( "#body-table" );
    ch1.destroy();
    ch2.destroy();
    ch1 = new Chart(chart1).PolarArea(wifiTestData);
    ch2 = new Chart(chart2).Bar(wifiTestData2);
  }

  function loadBluetoothTable(){
    cleanTable();
    $('#head-table tr').append('<td>Device</td>')
    $('#head-table tr').append('<td>Address</td>')

     var rows = "";
    $.each(testJson2.json.devices, function(){
    console.log(this);
    rows += "<tr><td>" + this.name + "</td><td>" +  this.address + "</td></tr>";
    });

    $( rows ).appendTo( "#body-table" );
    ch1.destroy();
    ch2.destroy();
    ch1 = new Chart(chart1).Pie(data);
    ch2 = new Chart(chart2).Line(data2);
  }

  function loadSwitchTable(){
    cleanTable();
    $('#head-table tr').append('<td>Type</td>')
    $('#head-table tr').append('<td>Mode</td>')

     var rows = "";
    $.each(testJson4.json.devices, function(){
    console.log(this);
    rows += "<tr><td>" + this.type + "</td><td>" +  this.mode + "</td></tr>";
    });

    $( rows ).appendTo( "#body-table" );
    ch1.destroy();
    ch2.destroy();
    ch1 = new Chart(chart1).Pie(data);
    ch2 = new Chart(chart2).Line(data2);

  }

  function loadMotionTable(){
    cleanTable();
    $('#head-table tr').append('<td>Type</td>')
    $('#head-table tr').append('<td>Status</td>')

     var rows = "";
    $.each(testJson3.json.devices, function(){
    console.log(this);
    rows += "<tr><td>" + this.type + "</td><td>" +  this.status + "</td></tr>";
    });

    $( rows ).appendTo( "#body-table" );
    ch1.destroy();
    ch2.destroy();
    ch1 = new Chart(chart1).Pie(data);
    ch2 = new Chart(chart2).Line(data2);
  }

  function loadSMSTable(){
    cleanTable();
    $('#head-table tr').append('<td>Type</td>')
    $('#head-table tr').append('<td>From</td>')

     var rows = "";
    $.each(testJson6.json.devices, function(){
    console.log(this);
    rows += "<tr><td>" + this.type + "</td><td>" +  this.from + "</td></tr>";
    });

    $( rows ).appendTo( "#body-table" );
    ch1.destroy();
    ch2.destroy();
    ch1 = new Chart(chart1).Bar(data2);
    ch2 = new Chart(chart2).Line(data2);
  }

  function loadLocationTable(){
    cleanTable();
    $('#head-table tr').append('<td>Type</td>')
    $('#head-table tr').append('<td>Location</td>')

     var rows = "";
    $.each(testJson5.json.devices, function(){
    console.log(this);
    rows += "<tr><td>" + this.type + "</td><td>" +  this.location + "</td></tr>";
    });

    $( rows ).appendTo( "#body-table" );
    ch1.destroy();
    ch2.destroy();
    ch1 = new Chart(chart1).Pie(data);
    ch2 = new Chart(chart2).Line(data2);
  }
