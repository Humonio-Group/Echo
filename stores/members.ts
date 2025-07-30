import type { TArray, TNull } from "~/types/globals/utils";
import type { ERole, IWorkspaceMember } from "~/types/workspaces";

export interface MembersState {
  members: TNull<TArray<IWorkspaceMember>>;
  loading: boolean;
}

export const useMembersStore = defineStore("members", {
  state: (): MembersState => ({
    members: null,
    loading: false,
  }),
  getters: {},
  actions: {
    async fetchMembers() {
      this.loading = true;

      try {
        const { data: members } = await useFetch<TArray<IWorkspaceMember>>(`/api/workspaces/${useWorkspaceStore().workspace?.id}/members`);
        this.members = members.value ?? [];
      }
      catch (e) {
        console.error(e);
      }
      finally {
        this.loading = false;
      }
    },
    async addMember(userId: string, role: ERole) {
      try {
        const member = await $fetch<IWorkspaceMember>(`/api/workspaces/${useWorkspaceStore().workspace?.id}/members/invite`, {
          method: "POST",
          body: {
            userId,
            role,
          },
        });

        this.members = [...this.members ?? [], member];
      }
      catch (e) {
        console.error(e);
      }
    },
  },
});
