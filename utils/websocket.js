let ws = null;

export function connectWebSocket(token, onMessage) {
  if (ws && ws.readyState === WebSocket.OPEN) return;

  ws = new WebSocket(`ws://localhost:8000/ws?token=${token}`);

  ws.onopen = () => {
    console.log("WebSocket connected");
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    onMessage(data);
  };

  ws.onclose = () => {
    console.log("WebSocket disconnected");
    ws = null;
  };

  ws.onerror = (error) => {
    console.error("WebSocket error:", error);
  };
}

export function disconnectWebSocket() {
  if (ws) {
    ws.close();
    ws = null;
  }
}