import type { FetchOptions } from 'ofetch';

/**
 * Wrapper for `$fetch` with customized Laravel Sanctum client.
 */
export const useLaravel = async <T>(path: string, options?: FetchOptions): Promise<T> => {
  const { $sanctum } = useNuxtApp();

  return await $sanctum(path, options).then((response: T) => response);
};
