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
  conversation: TNull<IConversation>;
}

export const useRoomStore = defineStore("room", {
  state: (): RoomState => ({
    roomId: null,
    messages: null,
    writing: false,
    conversation: null,
  }),
  getters: {
    isConnected: state => !!state.roomId,
    isStopped: state => state.conversation && new Date(state.conversation.stoppedAt).getTime() <= Date.now(),
    hasResult: state => state.conversation && state.conversation.assessments?.length,
  },
  actions: {
    async fetchRoomConversation(simId: string) {
      try {
        const { data } = await useFetch<IConversation>(`/api/workspaces/${useWorkspaceStore().workspace?.id}/conversations/${simId}`);
        if (!data.value) return navigateTo(useLocalePath()(useWorkspacePath("/training")));
        this.loadRoom(data.value);
      }
      catch (e) {
        console.error(e);
        navigateTo(useLocalePath()(useWorkspacePath("/training")));
      }
    },
    loadRoom(conv: IConversation) {
      this.roomId = conv.uid;
      this.writing = false;
      this.messages = conv.messages?.map(m => ({
        id: m.id,
        senderId: m.sender,
        message: m.content,
      })) ?? [];
      this.conversation = conv;
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
