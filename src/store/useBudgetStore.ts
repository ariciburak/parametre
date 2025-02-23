import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Budget, BudgetWithCategory, MonthlyBudgetSummary } from '../types/budget'
import { getCategoryById } from '../constants/categories'

interface BudgetStore {
  budgets: Budget[]
  
  // Bütçe işlemleri
  addBudget: (budget: Omit<Budget, 'id' | 'createdAt' | 'updatedAt' | 'spent'>) => void
  updateBudget: (id: string, updates: Partial<Budget>) => void
  deleteBudget: (id: string) => void
  
  // Bütçe sorgulama
  getBudgetsByMonth: (month: string) => BudgetWithCategory[]
  getMonthlyBudgetSummary: (month: string) => MonthlyBudgetSummary
  getBudgetByCategory: (categoryId: string, month: string) => Budget | undefined
}

const useBudgetStore = create<BudgetStore>()(
  persist(
    (set, get) => ({
      budgets: [],

      addBudget: (budgetData) => {
        const newBudget: Budget = {
          id: Date.now().toString(), // Geçici ID çözümü
          ...budgetData,
          spent: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        }

        set((state) => ({
          budgets: [...state.budgets, newBudget]
        }))
      },

      updateBudget: (id, updates) => {
        set((state) => ({
          budgets: state.budgets.map((budget) =>
            budget.id === id
              ? { ...budget, ...updates, updatedAt: new Date() }
              : budget
          )
        }))
      },

      deleteBudget: (id) => {
        set((state) => ({
          budgets: state.budgets.filter((budget) => budget.id !== id)
        }))
      },

      getBudgetsByMonth: (month) => {
        const { budgets } = get()
        return budgets
          .filter((budget) => budget.month === month)
          .map((budget) => {
            const category = getCategoryById(budget.categoryId)
            if (!category) throw new Error(`Category not found: ${budget.categoryId}`)
            
            return {
              ...budget,
              category,
              percentage: budget.amount > 0 ? (budget.spent / budget.amount) * 100 : 0
            }
          })
      },

      getMonthlyBudgetSummary: (month) => {
        const budgetsWithCategory = get().getBudgetsByMonth(month)
        
        const totalBudget = budgetsWithCategory.reduce((sum, b) => sum + b.amount, 0)
        const totalSpent = budgetsWithCategory.reduce((sum, b) => sum + b.spent, 0)
        
        return {
          month,
          totalBudget,
          totalSpent,
          percentage: totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0,
          categories: budgetsWithCategory
        }
      },

      getBudgetByCategory: (categoryId, month) => {
        const { budgets } = get()
        return budgets.find(
          (budget) => budget.categoryId === categoryId && budget.month === month
        )
      }
    }),
    {
      name: 'budget-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
)

export default useBudgetStore 