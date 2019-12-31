// var mqtt = require('mqtt');
// var opt = {
//   port:1883,
//   clientId: 'nodejs'
// }
// console.log('有執行');

// var client = mqtt.connect('tcp://192.168.3.136',opt);
// client.on('connect' , function(){
//   console.log('已連接至MQTT伺服器');
//   client.subscribe('home/yard/DHT11');
// });

// client.on('message', function(topic , msg){
//   console.log('收到 ' + topic + '主題-訊息:' + msg.toString());
// });

// var http = require('http');

// var server = http.createServer(function(request, response){
//   console.log('Connection');
//   response.writeHead(200, {'Content-Type': 'text/html'});
//   response.write('Hello, World.');
//   response.end();
// });

// server.listen(8001);

var mqtt = require('mqtt');
var opt = {
  port:1883,
  clientId: 'nodejs'
};
var io = require("socket.io");
var express = require("express");
var app = express();
app.use(express.static('www'));
var server = app.listen(5438);

var client  = mqtt.connect('tcp://192.168.3.136');
var sio = io.listen(server);

client.on('connect', function () {
  console.log('已連接至MQTT伺服器');
  client.subscribe("home/yard/DHT11");
});

sio.on('connection', function(socket){
  console.log('sio連線成功')
  client.on('message', function (topic, msg) { 
      console.log('收到 ' + topic + ' 主題，訊息：' + msg.toString());
      socket.emit('mqtt', { 'msg': msg.toString() });
  });
});

setInterval(() => {
  client.publish( "home/yard/DHT11" ,'{"temp":' + (Math.floor(Math.random() * 19) + 16)  + ', "humid":'+ Math.floor(Math.random() * 101) +'}')
}, 1000);