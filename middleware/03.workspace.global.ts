export default defineNuxtRouteMiddleware(async (to) => {
  if (!to.params.workspaceId) return;

  const workspaceId = Number(to.params.workspaceId);
  const store = useWorkspaceStore();
  const { workspace, workspaces } = storeToRefs(store);

  if (!workspaces.value) await store.loadWorkspaces();
  if (workspace.value?.id === workspaceId) return;
  store.selectWorkspace(workspaceId);
});
