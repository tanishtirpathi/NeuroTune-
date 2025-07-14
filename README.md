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
=-----------------------------------------------------------------------------------------------------------------------------------------------=
## ⚠️ Known Issues & Debug Info

### ❌ Controller Buttons Not Working (Commands Not Executing in Browser)

While the extension and Electron app are **both running fine** and data **flows from browser → Electron** via WebSocket, the issue arises in the **reverse flow**:

#### ✅ What Works:
- Media info (play/pause state, current time, title, etc.) is **sent correctly** from browser → Electron.
- Electron UI shows updated info (meaning connection is successful).
- WebSocket connection remains stable and responsive.

#### ❌ What’s Broken:
- When you click any control buttons (`Play`, `Next`, `Prev`, etc.) on the Electron UI:
  - The command is sent *from Electron* to the *browser extension* via WebSocket ✅
  - But **nothing happens in the actual media tab** ❌
  - i.e., `<video>` or `<audio>` is not being controlled in most tabs

---

### 🧪 Deep Debug Analysis:

| Step | Description | Status |
|------|-------------|--------|
| `main.js` → WebSocket Server started? | ✅ `ws://localhost:5678` runs |
| `background.js` connects to WebSocket? | ✅ Logs "Connected to Electron App" |
| `content.js` injected in tab? | ✅ Logs media info every second |
| `Electron` sends command → extension? | ✅ Logged in WebSocket `.onmessage` |
| `content.js` receives command? | ❌ **No log shown** (message not reaching tab script)

---

### 🕵️ Root Cause Hypothesis

1. **Chrome Tabs are sandboxed** — sometimes commands don't reach content script
2. **`chrome.tabs.sendMessage()` fails silently** if the tab:
   - has no active `content.js`
   - belongs to restricted domains (YouTube, Spotify Web, Netflix, etc.)
   - is an iframe (embedded player)
3. **Service Workers (Manifest V3)** sometimes don’t persist long enough to handle real-time WebSocket + tab message relay

---

