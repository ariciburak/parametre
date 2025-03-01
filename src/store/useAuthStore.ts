import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from 'firebase/auth';
import { auth } from '../firebase/config';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { migrateToFirestore } from '../utils/migration';

interface AuthState {
  user: User | null;
  isInitialized: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => Promise<void>;
  initialize: () => Promise<void>;
  resetAuth: () => Promise<void>;
}

const STORAGE_KEY = '@auth_credentials';
const MIGRATION_KEY = '@migration_completed';

interface StoredCredentials {
  email: string;
  password: string;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isInitialized: false,
  initialize: async () => {
    try {
      const storedCredentials = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedCredentials) {
        const { email, password } = JSON.parse(storedCredentials) as StoredCredentials;
        try {
          const { user } = await signInWithEmailAndPassword(auth, email, password);
          set({ user });
        } catch (error) {
          console.error('Error auto-signing in:', error);
          await AsyncStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch (error) {
      console.error('Error initializing auth store:', error);
      await AsyncStorage.removeItem(STORAGE_KEY);
    } finally {
      set({ isInitialized: true });
    }
  },
  resetAuth: async () => {
    try {
      await AsyncStorage.multiRemove([STORAGE_KEY, MIGRATION_KEY]);
      set({ user: null, isInitialized: true });
      console.log('Auth store reset successfully');
    } catch (error) {
      console.error('Error resetting auth store:', error);
    }
  },
  setUser: async (user) => {
    set({ user });

    if (user) {
      const migrationCompleted = await AsyncStorage.getItem(MIGRATION_KEY);
      if (!migrationCompleted) {
        try {
          await migrateToFirestore();
          await AsyncStorage.setItem(MIGRATION_KEY, 'true');
        } catch (error) {
          console.error('Migration error:', error);
        }
      }
    }
  },
  login: async (email, password) => {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ email, password }));
      set({ user });
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  register: async (email, password) => {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ email, password }));
      set({ user });
    } catch (error) {
      throw error;
    }
  },
  logout: async () => {
    try {
      await signOut(auth);
      await AsyncStorage.removeItem(STORAGE_KEY);
      set({ user: null });
    } catch (error) {
      throw error;
    }
  },
})); 