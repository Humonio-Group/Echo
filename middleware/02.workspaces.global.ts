export default defineNuxtRouteMiddleware(async () => {
  const store = useWorkspaceStore();
  store.loadWorkspaces().catch(err => console.error(err));
});
