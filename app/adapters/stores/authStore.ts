// app/adapters/stores/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { LoginUseCase } from '../../core/application/LoginUseCase';
import { User } from '../../core/domain/User';
import { AuthApiAdapter } from '../../core/infrastructure/AuthApiAdapter';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loginWithCredentials: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const loginUseCase = new LoginUseCase(new AuthApiAdapter());

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      loginWithCredentials: async (email, password) => {
        const { user, token } = await loginUseCase.execute(email, password);
        set({ user, token, isAuthenticated: true });
      },

      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: 'auth-storage', // clave para async-storage
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
