function isLocalhost() {
  return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
}

export function initWebsocket() {
  const connectWebSocket = () => {
    const host = window.location.host;
    const protocol = isLocalhost() ? "ws://" : "wss://";
    const socket = new WebSocket(protocol + host + "/ws");

    socket.onopen = () => {
      console.log("WebSocket connection established");
    };

    socket.onmessage = (event) => {
      const nodeUpdate = JSON.parse(event.data);
      console.log(nodeUpdate);
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.onclose = (event) => {
      console.warn("WebSocket connection closed:", event);
      setTimeout(connectWebSocket, 1000); // Reconnect after 1 second
    };

    window.spwashi.socket = socket;
  };

  // Initial connection attempt
  setTimeout(connectWebSocket, 100);
}
