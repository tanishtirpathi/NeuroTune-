let ws;
function connectWS() {
  console.log('Connecting to ws://localhost:5678...');
  ws = new WebSocket('ws://localhost:5678');
  ws.onopen = () => console.log('Connected to Electron app');
  ws.onclose = () => { console.log('WebSocket closed, retrying...'); setTimeout(connectWS, 2000); };
  ws.onmessage = (event) => {
    console.log('Received command from Electron app:', event.data);
    // Forward commands to all tabs with content script
    chrome.tabs.query({}, (tabs) => {
      for (const tab of tabs) {
        chrome.tabs.sendMessage(tab.id, { type: 'MEDIA_COMMAND', command: event.data });
      }
    });
  };
}
connectWS();

chrome.runtime.onMessage.addListener((msg, sender) => {
  if (msg.type === 'MEDIA_INFO' && ws && ws.readyState === 1) {
    console.log('Sending media info to Electron app:', msg.info);
    ws.send(JSON.stringify(msg.info));
  }
}); 