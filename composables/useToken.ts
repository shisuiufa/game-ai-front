
import type { Ref } from "vue";

interface UseToken {
  token: Ref<string | null>;
  set: (value: string) => void;
  clear: () => void;
}

export const useToken = (): UseToken => {
  const token = useState('token', () => {
    const stored = localStorage.getItem('token') as string;
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse token from localStorage', e);
      }
    }
    return null;
  });

  const set = (value: string) => {
    token.value = value;
    localStorage.setItem('token', JSON.stringify(value));
  };

  const clear = () => {
    token.value = null;
    localStorage.removeItem('token');
  };

  return {
    token,
    set,
    clear,
  };
};
