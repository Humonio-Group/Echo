export default defineNuxtPlugin(() => {
  // eslint-disable-next-line
  if (true) return;

  // Only run in development
  if (process.env.NODE_ENV !== "development") return;

  console.log("[WS Debug] WebSocket debugging enabled");

  // Test WebSocket connectivity
  const testWebSocketConnection = () => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const host = window.location.host;
    const wsUrl = `${protocol}//${host}/ws`;

    console.log("[WS Debug] Testing connection to:", wsUrl);

    const testSocket = new WebSocket(wsUrl);

    testSocket.addEventListener("open", () => {
      console.log("[WS Debug] ✅ Test connection successful");
      testSocket.close();
    });

    testSocket.addEventListener("error", (event) => {
      console.error("[WS Debug] ❌ Test connection failed:", event);
    });

    testSocket.addEventListener("close", (event) => {
      console.log("[WS Debug] Test connection closed:", event.code, event.reason);
    });

    // Timeout test
    setTimeout(() => {
      if (testSocket.readyState === WebSocket.CONNECTING) {
        console.error("[WS Debug] ❌ Test connection timeout");
        testSocket.close();
      }
    }, 5000);
  };

  // Run test after a short delay
  setTimeout(testWebSocketConnection, 1000);

  // Add global WebSocket debugging
  const originalWebSocket = window.WebSocket;
  window.WebSocket = class extends originalWebSocket {
    constructor(url: string | URL, protocols?: string | string[]) {
      console.log("[WS Debug] Creating WebSocket connection to:", url);
      super(url, protocols);

      // Log state changes
      this.addEventListener("open", () => {
        console.log("[WS Debug] ✅ WebSocket opened");
      });

      this.addEventListener("close", (event) => {
        console.log("[WS Debug] WebSocket closed:", {
          code: event.code,
          reason: event.reason,
          wasClean: event.wasClean,
        });
      });

      this.addEventListener("error", (event) => {
        console.error("[WS Debug] ❌ WebSocket error:", event);
      });

      this.addEventListener("message", (event) => {
        console.log("[WS Debug] 📨 Message received:", event.data);
      });
    }

    override send(data: string | ArrayBufferLike | Blob | ArrayBufferView) {
      console.log("[WS Debug] 📤 Sending message:", data);
      super.send(data);
    }
  };
});
