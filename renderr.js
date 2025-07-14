const audio = document.getElementById('audio');
const progressBar = document.getElementById('progress-bar');
const progress = document.getElementById('progress');
const { ipcRenderer } = require('electron');

function togglePlay() {
  if(!audio) return;
  if (audio.paused) {
    audio.play();
  } else {
    audio.pause();
  }
}

function next() {
  audio.currentTime = audio.duration || 0; // For demo, jump to end
}

function prev() {
  audio.currentTime = 0;
}

function skipBack10() {
  audio.currentTime = Math.max(0, audio.currentTime - 10);
}

function skipForward10() {
  audio.currentTime = Math.min(audio.duration, audio.currentTime + 10);
}

function volumeUp() {
  audio.volume = Math.min(1, audio.volume + 0.1);
}

function volumeDown() {
  audio.volume = Math.max(0, audio.volume - 0.1);
}

audio.addEventListener('timeupdate', updateProgress);
audio.addEventListener('loadedmetadata', updateProgress);

audio.addEventListener('play', updateProgress);
audio.addEventListener('pause', updateProgress);

audio.volume = 0.7;

function updateProgress() {
  if (!audio.duration) return;
  const percent = (audio.currentTime / audio.duration) * 100;
  progress.style.width = percent + '%';
}

function seek(event) {
  const rect = progressBar.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const percent = x / rect.width;
  if (audio.duration) {
    audio.currentTime = percent * audio.duration;
  }
}

ipcRenderer.on('media-control', (event, command) => {
  if (command === 'playpause') togglePlay();
  if (command === 'next') next();
  if (command === 'prev') prev();
  if (command === 'stop') { audio.pause(); audio.currentTime = 0; }
});
