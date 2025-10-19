export const isAuthorized = () => isBetaUser() || isAdminUser();
export const isBetaUser = () => {
  const config = useRuntimeConfig().public;
  const { userId } = useAuth();

  const betaUserIds = config.betaUserIds.split(",");
  return betaUserIds.includes(userId.value ?? "");
};
export const isAdminUser = () => {
  const config = useRuntimeConfig().public;
  const { userId } = useAuth();

  const adminUserIds = config.authorizedUserIds.split(",");
  return adminUserIds.includes(userId.value ?? "");
};
