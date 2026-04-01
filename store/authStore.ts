import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import * as api from '@/services/api';

interface AuthState {
  token: string | null;
  user: any | null;
  isLoading: boolean;
  setToken: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  loadToken: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isLoading: true,

  setToken: async (token) => {
    await SecureStore.setItemAsync('token', token);
    set({ token });
  },

  logout: async () => {
    await SecureStore.deleteItemAsync('token');
    set({ token: null, user: null });
  },

  loadToken: async () => {
    try {
      const token = await SecureStore.getItemAsync('token');
      if (token) {
        const user = await api.getMe();
        set({ token, user });
      }
    } catch (e) {
      await SecureStore.deleteItemAsync('token');
    } finally {
      set({ isLoading: false });
    }
  },
}));
