import { colors } from '../theme'
import type { MaterialCommunityIcons } from '@expo/vector-icons'

export type Category = {
  id: string
  label: string
  type: 'income' | 'expense'
  icon: keyof typeof MaterialCommunityIcons.glyphMap
  color: string
}

export const categories: Category[] = [
  // Gelir Kategorileri
  {
    id: 'salary',
    label: 'Maaş',
    type: 'income',
    icon: 'cash',
    color: colors.secondary.main,
  },
  {
    id: 'freelance',
    label: 'Serbest Çalışma',
    type: 'income',
    icon: 'laptop',
    color: colors.secondary.dark,
  },
  {
    id: 'investment',
    label: 'Yatırım',
    type: 'income',
    icon: 'chart-line',
    color: colors.secondary.light,
  },
  {
    id: 'gift',
    label: 'Hediye',
    type: 'income',
    icon: 'gift',
    color: colors.warning.main,
  },

  // Gider Kategorileri
  {
    id: 'food',
    label: 'Yiyecek & İçecek',
    type: 'expense',
    icon: 'food',
    color: colors.error.main,
  },
  {
    id: 'transportation',
    label: 'Ulaşım',
    type: 'expense',
    icon: 'bus',
    color: colors.error.dark,
  },
  {
    id: 'shopping',
    label: 'Alışveriş',
    type: 'expense',
    icon: 'shopping',
    color: colors.error.light,
  },
  {
    id: 'bills',
    label: 'Faturalar',
    type: 'expense',
    icon: 'file-document',
    color: colors.primary.main,
  },
  {
    id: 'health',
    label: 'Sağlık',
    type: 'expense',
    icon: 'medical-bag',
    color: colors.primary.light,
  },
  {
    id: 'entertainment',
    label: 'Eğlence',
    type: 'expense',
    icon: 'movie',
    color: colors.warning.dark,
  },
  {
    id: 'education',
    label: 'Eğitim',
    type: 'expense',
    icon: 'school',
    color: colors.primary.dark,
  },
]

export const getCategoriesByType = (type: 'income' | 'expense') => {
  return categories.filter(category => category.type === type)
}

export const getCategoryById = (id: string) => {
  return categories.find(category => category.id === id)
} 