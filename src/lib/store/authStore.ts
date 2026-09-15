import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { apiClient } from '../api/client';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR' | 'USER';
  avatar?: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;

  // Actions
  login: (accessToken: string, user: User) => void;
  logout: () => void;
  setAccessToken: (token: string) => void;
  setUser: (user: User) => void;
  initialize: () => Promise<void>;
  hasRole: (role: string) => boolean;
}

function mapApiUserToStore(raw: {
  id?: string | number;
  email?: string;
  name?: string;
  role?: string;
  avatar?: string;
}): User | null {
  const role = raw.role?.toUpperCase() as User["role"] | undefined;
  if (!role || !["SUPER_ADMIN", "ADMIN", "EDITOR", "USER"].includes(role)) {
    return null;
  }
  return {
    id: String(raw.id ?? ""),
    email: raw.email || "",
    name: raw.name || raw.email || "",
    role,
    avatar: raw.avatar,
  };
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null, // We persist this to handle page reloads if cookie fails, but primarily relies on cookie refresh
      isAuthenticated: false,
      isLoading: true,
      isInitialized: false,

      login: (accessToken, user) => {
        set({
          user,
          accessToken,
          isAuthenticated: true,
          isLoading: false,
          isInitialized: true,
        });
      },

      logout: () => {
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
          isLoading: false,
          isInitialized: false,
        });
      },

      setAccessToken: (token) => {
        set({ accessToken: token });
      },

      setUser: (user) => {
        set({ user });
      },

      initialize: async () => {
        if (get().isInitialized) return;

        set({ isLoading: true });
        try {
          const { data } = await apiClient.get("/users/me");
          if (data.success && data.data?.user) {
            const mapped = mapApiUserToStore(data.data.user);
            if (!mapped) {
              set({ user: null, accessToken: null, isAuthenticated: false });
              return;
            }
            const token = data.data.token ?? data.data.accessToken;
            if (token) {
              get().login(token, mapped);
            } else {
              set({
                user: mapped,
                isAuthenticated: true,
              });
            }
          }
        } catch {
          set({
            user: null,
            accessToken: null,
            isAuthenticated: false,
          });
        } finally {
          set({ isLoading: false, isInitialized: true });
        }
      },

      hasRole: (role) => {
        const user = get().user;
        if (!user) return false;
        if (user.role === 'SUPER_ADMIN') return true; // Super admin has all roles
        return user.role === role;
      }
    }),
    {
      name: 'auth-storage', // unique name
      storage: createJSONStorage(() => localStorage), // Persist user info
      partialize: (state) => ({ 
        // Only persist non-sensitive or necessary fields. 
        // Token persistence in localStorage is debated. 
        // Since we have HTTP-only cookies for refresh, we can persist accessToken for UX speed,
        // or clear it and rely on refresh. 
        // Security-wise: User asked for "accessToken in memory only".
        // BUT the persistence middleware saves to localStorage.
        // To follow "memory only" strictly, we should NOT persist accessToken.
        user: state.user,
        isAuthenticated: state.isAuthenticated
      }), 
    }
  )
);
