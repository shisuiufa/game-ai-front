export default defineNuxtRouteMiddleware((to) => {
    const user = useCurrentUser();
    const accessToken = useCookie("accessToken");

    if (!user.value && !accessToken.value) {
        if (to.path !== "/auth") {
            return navigateTo("/auth");
        }
    }

    if (user.value && to.path === "/auth") {
        return navigateTo("/");
    }
});
