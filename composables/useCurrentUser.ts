export const useCurrentUser = (): Ref<UserResource | null> => {
  const cookie = useCookie('profile') as Ref<{ user: UserResource | null } | undefined>;
  return useState<UserResource | null>('current-user', () => cookie.value?.user ?? null);
};