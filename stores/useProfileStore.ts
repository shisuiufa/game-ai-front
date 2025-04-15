import {defineStore} from "pinia";
import {useNotifications} from "~/composables/useNotifications";

export const useProfileStore = defineStore(
    'profile',
    () => {
        const {user, set, clear} = useCurrentUser();
        const {notifyError} = useNotifications();

        const loading = ref(false);

        const refreshToken = async () => {
            try {
                await useLaravel('/api/v1/refresh_token', {method: 'GET'});
            } catch (e) {
                console.log(e)
            }
        }

        const register = async (data): Promise<void> => {
            try {
                if (loading.value) return;

                loading.value = true;

                const response = await useLaravel('/api/auth/register', {
                    method: 'POST',
                    body: data,
                });

                set(response.data.user)
            } catch (e) {
                notifyError({description: e.message});
            } finally {
                loading.value = false;
            }
        };

        const login = async (credentials): Promise<void> => {
            try {
                if (loading.value) return;

                loading.value = true;

                const response = await useLaravel('/api/auth/login', {
                    method: 'POST',
                    body: credentials,
                });

                set(response.data.user)
            } catch (e) {
                notifyError({description: e.message});
            } finally {
                loading.value = false;
            }
        };

        const logout = async (): Promise<void> => {
            if (!user.value) {
                return;
            }

            await useLaravel('/api/auth/logout', {method: 'POST'}).finally(() => {
                clear();
                reloadNuxtApp();
            });
        };

        const fetchProfile = async (): Promise<void> => {
            try {
                const res = await useLaravel('/api/v1/profile', {method: 'GET'});
                if (user.value) {
                    user.value.points = res.data.points;
                }
            } catch (e){
                console.error(e)
            }
        };

        return {
            user,
            loading,
            register,
            login,
            logout,
            refreshToken,
            fetchProfile,
        };
    },
    {persist: true}
);
