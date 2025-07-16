import type { TArray, TNull } from "~/types/globals/utils";
import type { IWorkspace, IWorkspaceCreate } from "~/types/workspaces";

interface WorkspacesState {
  workspace: TNull<IWorkspace>;
  workspaces: TNull<TArray<IWorkspace>>;
  loading: {
    workspaces: boolean;
    creatingWorkspace: boolean;
  };
}

export const useWorkspaceStore = defineStore("workspaces", {
  state: (): WorkspacesState => ({
    workspace: null,
    workspaces: null,
    loading: {
      workspaces: false,
      creatingWorkspace: false,
    },
  }),
  getters: {
    translate: () => useNuxtApp().$i18n.t,
    isFirstLoading: state => !state.workspaces,
  },
  actions: {
    selectWorkspace(id: number) {
      if (!this.workspaces?.length) return;
      this.workspace = this.workspaces.find(w => w.id === id) ?? null;
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
  },
});
