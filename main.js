const WebSocket = require('ws');
let mainWindow;

require('electron-reload')(__dirname);

const { app, BrowserWindow, globalShortcut, ipcMain } = require("electron");

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 450,
    height: 200,
    alwaysOnTop: true,
    frame: false,
    transparent: true,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadFile("index.html");

  // Register global media shortcuts
  globalShortcut.register('MediaPlayPause', () => {
    mainWindow.webContents.send('media-control', 'playpause');
  });
  globalShortcut.register('MediaNextTrack', () => {
    mainWindow.webContents.send('media-control', 'next');
  });
  globalShortcut.register('MediaPreviousTrack', () => {
    mainWindow.webContents.send('media-control', 'prev');
  });
  globalShortcut.register('MediaStop', () => {
    mainWindow.webContents.send('media-control', 'stop');
  });
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

// WebSocket server for browser extension
const wss = new WebSocket.Server({ port: 5678 }, () => {
  console.log('WebSocket server started on ws://localhost:5678');
});

wss.on('connection', ws => {
  console.log('Browser extension connected via WebSocket');
  ws.on('message', message => {
    // Convert Buffer to string before parsing
    let msgStr = message;
    if (Buffer.isBuffer(message)) {
      msgStr = message.toString('utf8');
    }
    console.log('Received message from extension (string):', msgStr);
    try {
      const info = JSON.parse(msgStr);
      if (mainWindow) {
        mainWindow.webContents.send('media-info', info);
      }
    } catch (err) {
      console.error('Failed to parse message from extension:', err);
    }
  });

  // Listen for control commands from renderer
  ipcMain.on('media-command', (event, command) => {
    console.log('Sending command to extension:', command);
    ws.send(command);
  });
});
