export function isAuthorized() {
  const { userId } = useAuth();

  const config = useRuntimeConfig().public;
  const authorizedUserIds = config.authorizedUserIds.split(",");
  return authorizedUserIds.includes(userId.value ?? "");
}
