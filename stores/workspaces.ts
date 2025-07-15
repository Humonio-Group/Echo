import type { TArray, TNull } from "~/types/globals/utils";
import type { IWorkspace } from "~/types/workspaces";

interface WorkspacesState {
  workspace: TNull<IWorkspace>;
  workspaces: TNull<TArray<IWorkspace>>;
  loading: {
    workspaces: boolean;
  };
}

export const useWorkspaceStore = defineStore("workspaces", {
  state: (): WorkspacesState => ({
    workspace: null,
    workspaces: null,
    loading: {
      workspaces: false,
    },
  }),
  getters: {
    translate: () => useNuxtApp().$i18n.t,
    isFirstLoading: state => !state.workspaces,
    isLoadingList: state => state.loading.workspaces,
  },
  actions: {
    async loadWorkspaces() {
      this.loading.workspaces = true;

      await useWait(useMinMaxRandom(1000, 2000));
      this.workspaces = [
        {
          id: 1,
          name: "Humonio",
          description: null,
          picture: null,
          companyInfo: "Humonio",
          productOrService: "Humonio",
          values: "Humonio",
          ownerId: "loicmaes",
          createdAt: new Date(),
          updatedAt: new Date(),
          members: [],
        },
      ];

      this.loading.workspaces = false;
    },
  },
});
