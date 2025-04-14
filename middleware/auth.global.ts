export default defineNuxtRouteMiddleware((to) => {
    const {user} = useCurrentUser();
    const {token} = useToken();

    if (!user.value && !token.value) {
        if (to.path !== "/auth") {
            return navigateTo("/auth");
        }
    }

    if (user.value && to.path === "/auth") {
        return navigateTo("/");
    }
});
