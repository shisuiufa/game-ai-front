import { ofetch } from 'ofetch';
import { useApiPath } from '~/config/entrypoint';
import LaravelError from '~/utils/laravel-error';
import type {UserResource} from "~/resource/user";

enum ApiError {
  BadRequest = 400,
  UnprocessableContent = 422,
  Unauthorized = 401,
  Forbidden = 403,
  PageExpired = 419,
}

export default defineNuxtPlugin(async () => {
  const user: Ref<UserResource | null> = useCurrentUser();
  const profileCookie = useCookie('profile') as Ref<{ user: UserResource | null } | undefined>;

  const sanctum = ofetch.create({
    baseURL: useApiPath(),
    mode: 'cors',
    retry: false,
    credentials: 'include',
    headers: {
      Accept: 'application/json',
    },
    onResponseError: async ({ response }) => {
      const apiErrors: Set<ApiError> = new Set([
        ApiError.BadRequest,
        ApiError.UnprocessableContent,
      ]);

      if (apiErrors.has(response.status)) {
        throw new LaravelError(response._data);
      }

      const accessErrors: Set<ApiError> = new Set([
        ApiError.Unauthorized,
        ApiError.PageExpired,
        ApiError.Forbidden,
      ]);

      if (accessErrors.has(response.status)) {
        user.value = null;
        profileCookie.value = undefined;
        await navigateTo('/auth');
      }

      throw createError({
        message: response._data?.message || 'An unknown error occurred',
        statusCode: response.status,
        statusText: response.statusText,
      });
    },
  });

  return { provide: { sanctum } };
});
