import type { MaterialCommunityIcons } from '@expo/vector-icons';

export interface Category {
  id: string;
  name: string;
  color: string;
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
  type?: 'income' | 'expense';
}

export type CategoryId = Category['id']; 