# 🧠 NeuroTune: Browser Media Controller (Electron + Chrome Extension)

NeuroTune is a lightweight, glassy desktop media controller built using **Electron.js**. It pairs with a **Chrome Extension** to control any playing video or audio tab (like YouTube, Spotify Web, etc.) from a global floating widget — Tony Stark-style.

---

## ⚙️ Features

- 🎵 Always-on-top, draggable glassy media controller
- 🌐 Communicates with Chrome tabs via WebSocket bridge
- ⏯️ Play/Pause, Forward/Backward, Volume Control buttons
- 🧠 Uses global media keys (`MediaPlayPause`, `MediaNextTrack`, etc.)
- 🧩 Chrome extension auto-detects `<video>` or `<audio>` tags on any tab

---

## 📦 Installation

### 1. Clone this repo

```bash
git clone https://github.com/tanishtripathi/NeuroTune.git
cd NeuroTune
npm install
