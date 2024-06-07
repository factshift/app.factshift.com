export function initWebsocket() {
  const connectWebSocket = () => {
    const host = window.location.host;
    const socket = new WebSocket("ws://" + host + "/ws");

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
