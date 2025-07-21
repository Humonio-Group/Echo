import type { TArray, TNull } from "~/types/globals/utils";
import type { IWorkspace, IWorkspaceCreate, IWorkspaceUpdate } from "~/types/workspaces";
import type { ISimulator } from "~/types/simulators";
import { toast } from "vue-sonner";
import type { IConversation } from "~/types/conversations";
import type { FetchError } from "ofetch";

interface WorkspacesState {
  workspace: TNull<IWorkspace>;
  workspaces: TNull<TArray<IWorkspace>>;
  loading: {
    workspaces: boolean;
    creatingWorkspace: boolean;
    savingWorkspace: boolean;
    duplicatingSimulator: TArray<number>;
    creatingConversation: boolean;
  };
}

export const useWorkspaceStore = defineStore("workspaces", {
  state: (): WorkspacesState => ({
    workspace: null,
    workspaces: null,
    loading: {
      workspaces: false,
      creatingWorkspace: false,
      savingWorkspace: false,
      duplicatingSimulator: [],
      creatingConversation: true,
    },
  }),
  getters: {
    translate: () => useNuxtApp().$i18n.t,
    isFirstLoading: state => !state.workspaces,
    selectedWorkspace: state => state.workspace,
    simulators: state => state.workspace?.simulators ?? [],
  },
  actions: {
    selectWorkspace(id: number) {
      if (!this.workspaces?.length) return;
      this.workspace = this.workspaces.find(w => w.id === id) ?? null;
    },
    clearWorkspace() {
      this.workspace = null;
    },
    async loadWorkspaces() {
      this.loading.workspaces = true;

      try {
        const { data } = await useFetch<TArray<IWorkspace>>("/api/workspaces");
        if (!data.value) {
          this.workspaces = [];
          return;
        }
        this.workspaces = data.value;
      }
      catch (e) {
        console.error(e);
      }
      finally {
        this.loading.workspaces = false;
      }
    },
    async createWorkspace(body: IWorkspaceCreate): Promise<boolean> {
      this.loading.creatingWorkspace = true;
      let state = true;

      try {
        const workspace = await $fetch<IWorkspace>("/api/workspaces", {
          method: "POST",
          body,
        });

        if (!this.workspaces) this.workspaces = [];
        this.workspaces = [...this.workspaces, workspace];
        // TODO: toast
      }
      catch {
        // TODO: toast
        state = false;
      }
      finally {
        this.loading.creatingWorkspace = false;
      }

      return state;
    },
    async saveWorkspaceInfo(body: IWorkspaceUpdate): Promise<boolean> {
      if (!this.workspace) return false;
      const id = this.workspace.id;

      this.loading.savingWorkspace = true;
      let state = true;

      try {
        const workspace = await $fetch<IWorkspace>(`/api/workspaces/${id}`, {
          method: "PUT",
          body,
        });

        this.workspaces = this.workspaces?.map(w => w.id === id ? workspace : w) ?? [workspace];
        this.workspace = workspace;
        // TODO: toast
      }
      catch {
        state = false;
      }
      finally {
        this.loading.savingWorkspace = false;
      }

      return state;
    },

    async duplicateSimulator(simulatorId: number): Promise<boolean> {
      if (!this.workspace) return false;

      this.loading.duplicatingSimulator = [...this.loading.duplicatingSimulator, simulatorId];
      let state = true;

      try {
        const simulator = await $fetch<ISimulator>(`/api/workspaces/${this.workspace?.id}/simulators/create-from`, {
          method: "POST",
          body: {
            simulatorId,
          },
        });
        this.workspace.simulators = [...this.workspace?.simulators ?? [], simulator];
        // TODO: toast
      }
      catch {
        state = false;
      }
      finally {
        this.loading.duplicatingSimulator.splice(this.loading.duplicatingSimulator.indexOf(simulatorId), 1);
      }

      return state;
    },

    async startConversation(simulatorId: number) {
      toast.promise($fetch<IConversation>(`/api/workspaces/${this.workspace?.id}/conversations/create/${simulatorId}`, {
        method: "POST",
        body: {
          answers: [],
        },
      }), {
        loading: this.translate("dialogs.conversations.create-conversation.toasters.loading"),
        success: (data: IConversation) => {
          console.log(data);
          navigateTo(useLocalePath()(useWorkspacePath(`/simulations/${data.uid}/chat`)));
          return this.translate("dialogs.conversations.create-conversation.toasters.success");
        },
        error: () => this.translate("dialogs.conversations.create-conversation.toasters.error"),
      });
    },
  },
});
