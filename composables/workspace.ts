export const useWorkspacePath = (path: string) => {
  const store = useWorkspaceStore();
  const { workspace } = storeToRefs(store);

  if (!workspace.value) return path;
  return `/${workspace.value.id}/${path.startsWith("/") ? path.substring(1) : path}`;
};
