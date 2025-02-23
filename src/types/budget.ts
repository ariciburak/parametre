import { Category } from './category'

export interface Budget {
  id: string
  month: string // YYYY-MM formatında
  categoryId: string
  amount: number // Hedeflenen bütçe miktarı
  spent: number // Harcanan miktar
  createdAt: Date
  updatedAt: Date
}

export interface BudgetWithCategory extends Budget {
  category: Category
  percentage: number // Harcanan/Hedef yüzdesi
}

export interface BudgetFormValues {
  month: string
  categoryId: string
  amount: string // Form için string olarak tutuyoruz
}

export interface MonthlyBudgetSummary {
  month: string
  totalBudget: number
  totalSpent: number
  percentage: number
  categories: BudgetWithCategory[]
} 