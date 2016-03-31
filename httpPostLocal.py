import json
import bluetooth
from wifi import Cell, Scheme



def postResults():
  messageB = scanBluetooth()
  postJson(messageB)
  messageW = scanWiFi()
  postJson(messageW)
  
def scanBluetooth():
  nearby = broadcast()
  message = "{"
  for device in nearby:
    print device
    payload = "{'address' : '" + device[0] + "', 'name' : " + device[1] + "'}"
    message += payload
  return message
  
def scanWiFi():
  results = Cell.all('wlan0')
  return results
  
scanWiFi()
    #d = {
    #'first_name': 'Guido',
    #'second_name': 'Rossum',
    #'titles': ['BDFL', 'Developer'],}