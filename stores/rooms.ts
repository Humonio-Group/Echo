import type { TArray, TNull } from "~/types/globals/utils";
import type { IConversation } from "~/types/conversations";

interface RoomState {
  roomId: TNull<string>;
  messages: TNull<TArray<{
    id: number;
    senderId: string;
    message: string;
  }>>;
  writing: boolean;
}

export const useRoomStore = defineStore("room", {
  state: (): RoomState => ({
    roomId: null,
    messages: null,
    writing: false,
  }),
  getters: {
    isConnected: state => !!state.roomId,
  },
  actions: {
    loadRoom(conv: IConversation) {
      this.roomId = conv.uid;
      this.writing = false;
      this.messages = conv.messages?.map(m => ({
        id: m.id,
        senderId: m.sender,
        message: m.content,
      })) ?? [];
    },
    connect(roomId: string) {
      this.roomId = roomId;
      this.writing = false;
      this.messages = [];
    },
    disconnect() {
      this.roomId = null;
      this.messages = null;
      this.writing = false;
    },
    storeMessage(sender: string, message: string, writing: boolean = true) {
      if (!this.messages || !this.roomId) return;

      this.writing = writing;
      this.messages = [...this.messages, {
        id: this.messages.length + 1,
        senderId: sender,
        message,
      }];
    },
  },
});
