import type { UserResource } from "~/resource/user";
import type { Ref } from "vue";

interface UseCurrentUser {
  user: Ref<UserResource | null>;
  set: (value: UserResource) => void;
  clear: () => void;
}

export const useCurrentUser = (): UseCurrentUser => {
  const user = useState<UserResource | null>('user', () => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        return JSON.parse(stored) as UserResource;
      } catch (e) {
        console.error('Failed to parse user from localStorage', e);
      }
    }
    return null;
  });

  const set = (value: UserResource) => {
    user.value = value;
    localStorage.setItem('user', JSON.stringify(value));
  };

  const clear = () => {
    user.value = null;
    localStorage.removeItem('user');
  };

  return {
    user,
    set,
    clear,
  };
};
