function getMediaElement() {
  return document.querySelector('video, audio');
}

function sendMediaInfo() {
  const media = getMediaElement();
  if (!media || media.readyState === 0) return; // ensure media is loaded

  const info = {
    paused: media.paused,
    currentTime: media.currentTime,
    duration: media.duration,
    volume: media.volume,
    src: media.currentSrc || media.src || '',
    title: document.title || 'Untitled'
  };

  console.log('✅ Content script: sending media info', info);
  chrome.runtime.sendMessage({ type: 'MEDIA_INFO', info });
}

// Poll media info every second
setInterval(sendMediaInfo, 1000);

// Listen for media control commands from extension
chrome.runtime.onMessage.addListener((msg) => {
  const media = getMediaElement();
  if (!media) {
    console.warn('⚠️ No media element found for command:', msg.command);
    return;
  }

  if (msg.type === 'MEDIA_COMMAND') {
    console.log('📥 Content script: received command', msg.command);
    switch (msg.command) {
      case 'playpause':
        media.paused ? media.play() : media.pause();
        break;
      case 'next':
        media.currentTime += 10;
        break;
      case 'prev':
        media.currentTime -= 10;
        break;
      case 'stop':
        media.pause();
        media.currentTime = 0;
        break;
      case 'volup':
        media.volume = Math.min(1, media.volume + 0.1);
        break;
      case 'voldown':
        media.volume = Math.max(0, media.volume - 0.1);
        break;
      default:
        console.warn('⚠️ Unknown command received:', msg.command);
        break;
    }
  }
});
