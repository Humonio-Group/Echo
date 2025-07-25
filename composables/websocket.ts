import { EventType } from "~/types/globals/websocket";
import type { WSConversationAssessmentsGeneratedEvent, WSJoinedEvent } from "~/types/globals/websocket";

export const useWebSocketRoom = (id: Ref<string> | string) => {
  const socket = shallowRef<WebSocket | null>();
  const store = useRoomStore();
  const { roomId } = storeToRefs(store);

  const room = typeof id === "string" ? ref(id) : id;

  const getWebSocketUrl = () => {
    if (import.meta.server) return null;

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const host = window.location.host;
    return `${protocol}//${host}/ws`;
  };

  const connect = async () => {
    if (import.meta.server) return;

    const wsUrl = getWebSocketUrl();
    if (!wsUrl) return;

    try {
      if (socket.value) {
        socket.value.close();
        socket.value = null;
      }

      socket.value = new WebSocket(wsUrl);

      socket.value.addEventListener("open", async () => {
        store.connect(room.value);
        send({
          type: EventType.JOIN,
          room: room.value,
        });
      });

      socket.value.addEventListener("message", (event) => {
        try {
          handleMessage(JSON.parse(event.data));
        }
        catch (err) {
          console.error("[WS] Error parsing message:", err);
        }
      });

      socket.value.addEventListener("close", (/* event */) => {
        store.disconnect();
        /* switch (event.code) {
          case 1000: {
            console.log("[WS] Connection closed normally");
            break;
          }
          case 1006: {
            console.log("[WS] Connection closed abnormally");
            break;
          }
          default: {
            console.log("[WS] Connection closed with code:", event.code);
            break;
          }
        } */
      });

      socket.value.addEventListener("error", (event) => {
        console.error("[WS] WebSocket error:", event);
      });
    }
    catch (err) {
      console.error("[WS] Failed to create WebSocket:", err);
    }
  };

  // eslint-disable-next-line
  const handleMessage = (data: any) => {
    switch (data.type) {
      case EventType.JOINED: {
        if (!data.conversation) break;
        useRoomStore().loadRoom((data as WSJoinedEvent).conversation);
        break;
      }

      case EventType.MESSAGE: {
        if (!data.sender || !data.message || !data.room) break;
        store.storeMessage(data.sender, data.message, false);
        break;
      }

      case EventType.ASSESSMENTS_GENERATED: {
        const payload = data as WSConversationAssessmentsGeneratedEvent;
        console.log(payload);
        // TODO: handle in front
        break;
      }

      default: {
        console.warn("[WS] Unknown message type:", data.type);
      }
    }
  };

  // eslint-disable-next-line
  const send = (data: any) => {
    if (socket.value?.readyState === WebSocket.OPEN) {
      socket.value.send(JSON.stringify(data));
      return true;
    }
    else {
      console.warn("[WS] Cannot send: socket not open. State:", socket.value?.readyState);
      return false;
    }
  };

  const sendMessage = (sender: string, text: string) => {
    store.storeMessage(sender, text);
    return send({
      type: EventType.MESSAGE,
      message: text,
      room: roomId.value,
      sender: sender,
    });
  };

  const leave = () => {
    if (socket.value?.readyState === WebSocket.OPEN && roomId.value) {
      send({ type: EventType.LEAVE, room: roomId.value });
    }

    // Close socket
    if (socket.value) {
      socket.value.close(1000, "Manual disconnect");
    }
  };

  // Lifecycle hooks
  onMounted(() => {
    // Wait for Clerk to be ready
    if (import.meta.client) {
      nextTick(() => {
        connect();
      });
    }
  });

  onBeforeUnmount(() => {
    leave();
  });

  // Watch for room changes
  watch(room, (newRoom, oldRoom) => {
    if (newRoom !== oldRoom && socket.value?.readyState === WebSocket.OPEN) {
      if (oldRoom) {
        send({ type: EventType.LEAVE, room: oldRoom });
      }
      if (newRoom) {
        setTimeout(() => {
          send({ type: EventType.JOIN, room: newRoom });
        }, 100);
      }
    }
  });

  return {
    socket: readonly(socket),
    send,
    sendMessage,
    leave,
    reconnect: connect,
  };
};
