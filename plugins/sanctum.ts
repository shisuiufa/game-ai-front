import { ofetch } from 'ofetch';
import { useApiPath } from '~/config/entrypoint';
import LaravelError from '~/utils/laravel-error';
import {useToken} from "~/composables/useToken";

enum ApiError {
  BadRequest = 400,
  UnprocessableContent = 422,
  Unauthorized = 401,
  Forbidden = 403,
  PageExpired = 419,
  ServerError = 500,
}

export default defineNuxtPlugin(async () => {
  const {clear} = useCurrentUser();
  const {token, clear: clearToken, set: setToken} = useToken();

  const sanctum = ofetch.create({
    baseURL: useApiPath(),
    headers: {
      Accept: 'application/json',
    },
    onRequest: async ({ options }) => {
      if (token.value) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${token.value}`,
        };
      }
    },
    onResponse({ response }) {
      if (response._data.data?.accessToken) {
        setToken(response._data.data.accessToken)
      }
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
        clear()
        clearToken()
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
