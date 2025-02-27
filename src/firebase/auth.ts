import { auth } from './config';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User
} from 'firebase/auth';

// Kayıt ol
export const register = async (email: string, password: string): Promise<User> => {
  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  return user;
};

// Giriş yap
export const login = async (email: string, password: string): Promise<User> => {
  const { user } = await signInWithEmailAndPassword(auth, email, password);
  return user;
};

// Çıkış yap
export const logout = async (): Promise<void> => {
  await signOut(auth);
};

// Mevcut kullanıcıyı al
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
}; 