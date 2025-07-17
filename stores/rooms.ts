import type { TArray, TNull } from "~/types/globals/utils";

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
  getters: {},
  actions: {
    // TODO: load room
    connect() {
      this.roomId = "1";
      this.messages = [
        {
          id: 1,
          senderId: "ia",
          message: "Bonjour Loïc",
        },
        {
          id: 2,
          senderId: "loic",
          message: "Bonjour IA",
        },
        {
          id: 3,
          senderId: "ia",
          message: "On va donc commencer notre simulation. Tu es prêt ? Alors c'est partit !",
        },
      ];
    },
    async sendMessage(message: string) {
      if (!this.messages || !this.roomId) return;

      this.messages = [...this.messages, {
        id: this.messages.length + 1,
        senderId: "me",
        message,
      }];
      this.writing = true;

      await useWait(750);

      this.writing = false;
      this.messages = [...this.messages, {
        id: this.messages.length + 1,
        senderId: "ia",
        message,
      }];
    },
  },
});
