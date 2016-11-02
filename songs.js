var five = require('johnny-five');
var songs = require('j5-songs');

five.Board().on('ready', function () {
  var piezo = new five.Piezo(3);

  // Load a song object
  var song = songs.load('never-gonna-give-you-up');

  // Play it !
  piezo.play(song);

  // List all songs
  songs.list(function (err, tunes) {
    // Object literal with all the songs
  });
});
