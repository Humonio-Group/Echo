const isPublicRoute = createRouteMatcher([
  "/sign-up(.*)",
  "/sign-in(.*)",
]);

export default defineNuxtRouteMiddleware((to) => {
  const { userId } = useAuth();

  if (!isPublicRoute(to) && !userId.value) return navigateTo(useLocalePath()("/sign-in"));
});
