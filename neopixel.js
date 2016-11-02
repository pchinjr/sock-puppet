
pixel = require("node-pixel");
five = require("johnny-five");

var opts = {};
opts.port = process.argv[2] || "";

var board = new five.Board(opts);
var strip = null;

var sequences = [];
var sequenceInterval;
var sequence_idx = 0;
var current_pos;

var MILLIS = 20; 
var DURATION = 5000;

board.on("ready", function() {

  strip = new pixel.Strip({
    data: 6,
    length: 16,
    board: this,
    controller: "FIRMATA",
  });

  sequences.push(
    function() {
      current_pos = 1;
      sequenceInterval = setInterval(function() {
        strip.color("rgb(127, 127, 127)");

        var p = strip.pixel(current_pos);
        p.color("black");
        if (current_pos+1 >= strip.stripLength()) { current_pos = 1; }
        else { current_pos++; }

        strip.show();
      }, MILLIS);
    }
  );

  sequences.push(
    function() {
      current_pos = 1;
      var current_color = 0;
      var mult = 1;

      strip.color("black");

      sequenceInterval = setInterval(function() {
        strip.color("rgb("+current_color+", "+current_color+", "+current_color+")");

        if (current_color >= 180) { mult = -1; }
        if (current_color <= 0) { mult = 1; }

        current_color =  current_color + (4 * mult);

        strip.show();
      }, MILLIS);
    }
  );

  strip.on("ready", function() {
    setInterval(function(){
      if (sequenceInterval) clearInterval(sequenceInterval);
      sequences[sequence_idx]();
      if (sequence_idx+1 >= sequences.length) { sequence_idx = 0; }
      else { sequence_idx++; }
    }, DURATION);
  });

});
