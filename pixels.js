pixel = require("node-pixel");
five = require("johnny-five");

var board = new five.Board;
var strip = null;

board.on("ready", function() {

    strip = new pixel.Strip({
        board: this,
        controller: "FIRMATA",
        strips: [ {pin: 6, length: 4}, ], // this is preferred form for definition
    });

    strip.on("ready", function() {
        strip.show();
    });
});
