import { User } from '@/types/auth/user';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface IAuthState {
  isAdmin: boolean;
  setIsAdmin: (isAdmin: boolean) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  userPermissionsFetched: boolean;
  setUserPermissionsFetched: (userPermissionFetched: boolean) => void;
  user: User | undefined;
  setUser: (user: User) => void;
  accessToken: string;
  setAccessToken: (accessToken: string) => void;
  expiresIn: number;
  setAccessTokenExpiresIn: (expiresIn: number) => void;
  clear: () => void;
}

const initialState = {
  isAdmin: false,
  isAuthenticated: false,
  user: undefined,
  accessToken: '',
  expiresIn: 0,
  userPermissionsFetched: false,
};

export const useAuthStore = create<IAuthState>()(
  devtools(
    persist(
      set => ({
        ...initialState,
        setIsAdmin: (isAdmin: boolean) => set(() => ({ isAdmin: isAdmin })),
        setIsAuthenticated: (isAuthenticated: boolean) =>
          set(() => ({ isAuthenticated: isAuthenticated })),
        setUser: (user: User | undefined) => set(() => ({ user: user })),
        setAccessToken: (accessToken: string) =>
          set(() => ({ accessToken: accessToken })),
        setAccessTokenExpiresIn: (expiresIn: number) =>
          set(() => ({ expiresIn: expiresIn })),
        setUserPermissionsFetched: (userPermissionsFetched: boolean) =>
          set(() => ({ userPermissionsFetched: userPermissionsFetched })),
        clear: () =>
          set(() => ({
            ...initialState,
          })),
      }),
      {
        name: 'auth-storage',
        partialize: state => ({ isAuthenticated: state.isAuthenticated }),
      },
    ),
  ),
);
