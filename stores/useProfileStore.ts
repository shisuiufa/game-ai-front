import type { ResourceItem } from '~/types/api-resource';
import {defineStore} from "pinia";
import {useNotifications} from "~/composables/useNotifications";

export const useProfileStore = defineStore(
    'profile',
    () => {
        const user = useCurrentUser();
        const { notifyError } = useNotifications();

        const loading = ref(false);

        const register = async (data): Promise<void> => {
            try {
                if (loading.value) return;

                loading.value = true;

                const response = await useLaravel('/api/auth/register', {
                    method: 'POST',
                    body: data,
                });

                user.value = response.data;
            } catch (e){
                notifyError({ description: e.message });
            } finally {
                loading.value = false;
            }
        };

        const login = async (credentials): Promise<void> => {
            try {
                if (loading.value || user.value !== null) return;

                loading.value = true;

                const response = await useLaravel('/api/auth/login', {
                    method: 'POST',
                    body: credentials,
                });

                user.value = response.data;
            } catch (e) {
                notifyError({ description: e.message });
            } finally {
                loading.value = false;
            }
        };

        const logout = async (): Promise<void> => {
            if (!user.value) {
                return;
            }

            await useLaravel('/api/auth/logout', { method: 'POST' }).finally(() => {
                user.value = null;
                reloadNuxtApp();
            });
        };

        return {
            user,
            loading,
            register,
            login,
            logout,
        };
    },
    { persist: true }
);
