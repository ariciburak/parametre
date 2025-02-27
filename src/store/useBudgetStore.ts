import { create } from 'zustand'
import type { Budget, BudgetWithCategory, MonthlyBudgetSummary, BudgetFormValues } from '../types/budget'
import * as FirestoreService from '../firebase/firestore'
import { getCategoryById } from '../constants/categories'

interface BudgetState {
  budgets: Budget[]
  isLoading: boolean
  error: string | null
  addBudget: (budget: BudgetFormValues) => Promise<void>
  updateBudget: (id: string, budget: Partial<Budget>) => Promise<void>
  deleteBudget: (id: string) => Promise<void>
  getBudgetByCategory: (categoryId: string, month: string) => Budget | undefined
  getBudgetsByMonth: (month: string) => BudgetWithCategory[]
  getMonthlyBudgetSummary: (month: string) => MonthlyBudgetSummary
  initialize: () => void
}

const useBudgetStore = create<BudgetState>((set, get) => ({
  budgets: [],
  isLoading: true,
  error: null,

  initialize: () => {
    // Firestore'dan verileri dinlemeye başla
    const unsubscribe = FirestoreService.subscribeToBudgets(
      (budgets) => {
        set({
          budgets,
          isLoading: false,
          error: null,
        })
      },
      (error) => {
        set({ error: error.message, isLoading: false })
      }
    )

    // Component unmount olduğunda listener'ı kaldır
    return unsubscribe
  },

  addBudget: async (formValues: BudgetFormValues) => {
    try {
      // Form değerlerini Budget tipine dönüştür
      const now = new Date()
      const newBudget: Omit<Budget, 'id'> = {
        month: formValues.month,
        categoryId: formValues.categoryId,
        amount: Number(formValues.amount.replace(/\./g, '').replace(/,/g, '.')),
        spent: 0,
        createdAt: now,
        updatedAt: now
      }
      await FirestoreService.addBudget(newBudget)
    } catch (error) {
      console.error('Error adding budget:', error)
      throw error
    }
  },

  updateBudget: async (id: string, budgetUpdate: Partial<Budget>) => {
    try {
      const updateData = {
        ...budgetUpdate,
        updatedAt: new Date()
      }
      await FirestoreService.updateBudget(id, updateData)
    } catch (error) {
      console.error('Error updating budget:', error)
      throw error
    }
  },

  deleteBudget: async (id: string) => {
    try {
      await FirestoreService.deleteBudget(id)
    } catch (error) {
      console.error('Error deleting budget:', error)
      throw error
    }
  },

  getBudgetByCategory: (categoryId: string, month: string) => {
    return get().budgets.find(
      (budget) => budget.categoryId === categoryId && budget.month === month
    )
  },

  getBudgetsByMonth: (month: string) => {
    const { budgets } = get()
    return budgets
      .filter((budget) => budget.month === month)
      .map((budget) => {
        const category = getCategoryById(budget.categoryId)
        if (!category) throw new Error(`Category not found: ${budget.categoryId}`)
        
        return {
          ...budget,
          category,
          percentage: budget.amount > 0 ? ((budget.spent || 0) / budget.amount) * 100 : 0
        }
      })
  },

  getMonthlyBudgetSummary: (month: string) => {
    const budgetsWithCategory = get().getBudgetsByMonth(month)
    
    const totalBudget = budgetsWithCategory.reduce((sum, b) => sum + (b.amount || 0), 0)
    const totalSpent = budgetsWithCategory.reduce((sum, b) => sum + (b.spent || 0), 0)
    
    return {
      month,
      totalBudget,
      totalSpent,
      percentage: totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0,
      categories: budgetsWithCategory
    }
  },
}))

export default useBudgetStore 