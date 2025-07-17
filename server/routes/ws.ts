import type { PeerData, WSEvent } from "~/types/globals/websocket";
import type { TNull } from "~/types/globals/utils";
import { handleMessage, leave } from "~/server/services/globals/websockets";

export default defineWebSocketHandler({
  open(peer) {
    peer.context.data = { room: null } as PeerData;
  },
  close(peer) {
    leave(peer);
  },
  message(peer, message) {
    let data: TNull<WSEvent> = null;

    try {
      data = JSON.parse(message.toString());
    }
    catch {
      return;
    }

    handleMessage(peer, data as WSEvent);
  },
  error(peer, error) {
    console.error(error);
  },
});
