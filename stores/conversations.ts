import type { TArray, TNull } from "~/types/globals/utils";
import type { IConversation } from "~/types/conversations";

interface ConversationState {
  conversations: TNull<TArray<IConversation>>;
  loading: boolean;
}

export const useConversationStore = defineStore("conversations", {
  state: (): ConversationState => ({
    conversations: null,
    loading: false,
  }),
  getters: {
    ongoingConversations: state => state.conversations?.filter(conv => new Date(conv.stoppedAt).getTime() > Date.now()) ?? [],
    pastConversations: state => state.conversations?.filter(conv => new Date(conv.stoppedAt).getTime() <= Date.now()) ?? [],
  },
  actions: {
    async loadConversations() {
      this.loading = true;

      try {
        const { data } = await useFetch<TArray<IConversation>>(`/api/workspaces/${useWorkspaceStore().workspace?.id}/conversations`);
        this.conversations = data.value ?? [];
      }
      catch (err) {
        console.error(err);
      }
      finally {
        this.loading = false;
      }
    },
  },
});
