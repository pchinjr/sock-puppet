// server.js
var express = require('express');
var app = express();
var server = require("http").createServer(app);
var five = require("johnny-five");
var io = require('socket.io')(server);

var port = 3000;

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
        res.sendFile(__dirname + '/public/index.html');
});

server.listen(port);
console.log('Cage Bot is now available to worship at http://localhost:' + port);

var led;

//Arduino board connection

var board = new five.Board();
board.on("ready", function() {
    led = new five.Led(13);
    servo = new five.Servo({
      pin: 10,
      center: true
    });
    photoresistor = new five.Sensor({
      pin:'A0',
      freq: 25
    });
    console.log('Arduino connected');
});

//Socket connection handler
io.on('connection', function (socket) {
        console.log("your socket id is ", socket.id);

        socket.on('join', function(data) {
          console.log('worshiper connected');
        });

        socket.on('led:on', function() {
           led.on();
           console.log('LED ON RECEIVED');
        });

        socket.on('led:off', function () {
            led.stop().off();
            console.log('LED OFF RECEIVED');
        });

        socket.on('led:blink', function () {
            led.blink(300);
            console.log('LED BLINK RECEIVED');
        });

        socket.on('servo:sweep', function () {
            servo.sweep();
            console.log('SERVO SWEEP RECEIVED');
        });

        socket.on('servo:stop', function () {
            servo.stop();
            console.log('SERVO STOP RECEIVED');
        });

        photoresistor.scale(0,255).on('data', function() {
          socket.emit('push', Math.round(this.value));
        });

        socket.on('disconnect', function() {
          console.log('browser closed');
        })
    });

console.log('Waiting for arduino connection..');
