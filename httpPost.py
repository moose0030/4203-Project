import json
import bluetooth
import urllib2
from wifi import Cell, Scheme
import sched, time

def scanBluetooth():
    nearby_devices = bluetooth.discover_devices()
    devices = []
    for device in nearby_devices:
        name = bluetooth.lookup_name(device,5)
        devices.append(json.dumps({'name':name,'address':device}))
    return json.dumps({'type':'RPI-BT','devices':devices})
                
def scanWifi():
    access_points = Cell.all('wlan0')
    devices = []
    for ap in access_points:
         devices.append(json.dumps({'ssid':ap.ssid, 'signal':ap.signal, 'channel':ap.channel, 'address':ap.address}))
    
    return json.dumps({'type':'RPI-WIFI','devices':devices})

def httpPost(url,payload):
    request = urllib2.Request(url)
    request.add_header('Content-Type', 'application/json')
    response = urllib2.urlopen(request,payload)

def callBoth(sc):
    httpPost('http://4203.azurewebsites.net',scanWifi())
    httpPost('http://4203.azurewebsites.net',scanBluetooth())
    sc.enter(30,1,callBoth,(sc,))

s = sched.scheduler(time.time,time.sleep);
s.enter(30,1,callBoth,(s,))
s.run()

