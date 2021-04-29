//Music function to be exculded near the end
var audio = document.getElementById('audio');

function play() {
  audio.play();
}

function pause() {
  if (audio.paused) {
    audio.play();
  } else {
    audio.pause();
  }
}

function stop() {
  audio.pause();
  audio.currentTime = 0;
}