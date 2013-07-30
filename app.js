var app = require('express')();
var fs = require('fs');

var options = {
  key: fs.readFileSync(__dirname+'/private.pem'),
  cert: fs.readFileSync(__dirname+'/public.pem')
};

var server = require('http').createServer(app);
server.listen(17070);
var webRTC = require('webrtc.io').listen(server);



app.get('/', function(req, res) {
    res.sendfile(__dirname + '/index.html');
});

app.get('/style.css', function(req, res) {
    res.sendfile(__dirname + '/style.css');
});

app.get('/webrtc.io.js', function(req, res) {
    res.sendfile(__dirname + '/webrtc.io.js');
});

app.get('/js/jquery-1.7.2.js', function(req, res) {
    res.sendfile(__dirname + '/js/jquery-1.7.2.js');
});

app.get('/channel', function(req, res) {
    res.sendfile(__dirname + '/channel.html');
});


webRTC.rtc.on('connect', function(rtc) {
    console.log('connect');
});

webRTC.rtc.on('send answer', function(rtc) {
    console.log('send answer');
});

webRTC.rtc.on('disconnect', function(rtc) {
    console.log('disconnect');
});

webRTC.rtc.on('update_room', function(data, socket) {
    var room = webRTC.rtc.rooms[data.room];
    console.log('update_room', data.room);
    for(var i in room) {
        var socketId = room[i];
        var soc = webRTC.rtc.getSocket(socketId);
  
        if (soc) {
            console.log('sending room info');
            soc.send(JSON.stringify({
                "eventName": "room_info",
                "data": {
                    "room": data.room,
                    "users": webRTC.rtc.rooms[data.room],
                }
            }), function(error) {
                if (error) {
                    console.log('Error sending room info:' + error);
                }
            });
        }
    }
});
