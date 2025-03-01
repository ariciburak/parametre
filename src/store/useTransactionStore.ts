import { create } from 'zustand'
import type { Transaction, TransactionFormValues } from '../types/transaction'
import useBudgetStore from './useBudgetStore'
import * as FirestoreService from '../firebase/firestore'
import { auth } from '../firebase/config'

interface TransactionState {
  transactions: Transaction[]
  totalIncome: number
  totalExpense: number
  isLoading: boolean
  error: string | null
  addTransaction: (transaction: TransactionFormValues) => Promise<void>
  removeTransaction: (id: string) => Promise<void>
  updateTransaction: (id: string, transaction: Partial<Transaction>) => Promise<void>
  initialize: () => void
}

const calculateTotals = (transactions: Transaction[]) => {
  return transactions.reduce(
    (acc, transaction) => {
      if (transaction.type === 'income') {
        acc.totalIncome += transaction.amount
      } else {
        acc.totalExpense += transaction.amount
      }
      return acc
    },
    { totalIncome: 0, totalExpense: 0 }
  )
}

const useTransactionStore = create<TransactionState>((set, get) => ({
  transactions: [],
  totalIncome: 0,
  totalExpense: 0,
  isLoading: true,
  error: null,

  initialize: () => {
    // Firestore'dan verileri dinlemeye başla
    const unsubscribe = FirestoreService.subscribeToTransactions(
      (transactions) => {
        const { totalIncome, totalExpense } = calculateTotals(transactions)
        set({
          transactions,
          totalIncome,
          totalExpense,
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

  addTransaction: async (formValues: TransactionFormValues) => {
    try {
      const transaction: Omit<Transaction, 'id'> = {
        type: formValues.type,
        amount: formValues.amount ? Number(formValues.amount.replace(/\./g, '').replace(/,/g, '.')) : 0,
        categoryId: formValues.categoryId,
        date: formValues.date,
        description: formValues.description,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      let budgetUpdate;
      // Eğer gider işlemiyse bütçe güncellemesi için bilgileri hazırla
      if (transaction.type === 'expense') {
        const date = new Date(transaction.date)
        const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        const budget = useBudgetStore.getState().getBudgetByCategory(transaction.categoryId, month)
        
        if (budget) {
          budgetUpdate = {
            budgetId: budget.id,
            currentSpent: (budget.spent || 0) + transaction.amount
          }
        }
      }

      // İşlem ve bütçe güncellemesini tek seferde yap
      await FirestoreService.addTransactionWithBudgetUpdate(transaction, budgetUpdate)
    } catch (error) {
      console.error('Error adding transaction:', error)
      throw error
    }
  },

  removeTransaction: async (id: string) => {
    try {
      const transaction = get().transactions.find((t) => t.id === id)
      if (!transaction) return

      let budgetUpdate;
      if (transaction.type === 'expense') {
        const date = new Date(transaction.date)
        const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        const budget = useBudgetStore.getState().getBudgetByCategory(transaction.categoryId, month)
        
        if (budget) {
          budgetUpdate = {
            budgetId: budget.id,
            currentSpent: Math.max(0, (budget.spent || 0) - transaction.amount)
          }
        }
      }

      await FirestoreService.removeTransactionWithBudgetUpdate(id, budgetUpdate)
    } catch (error) {
      console.error('Error removing transaction:', error)
      throw error
    }
  },

  updateTransaction: async (id: string, updatedFields: Partial<Transaction>) => {
    try {
      const oldTransaction = get().transactions.find((t) => t.id === id)
      if (!oldTransaction) return

      const updatedTransaction = {
        ...updatedFields,
        updatedAt: new Date(),
      }

      let budgetUpdates: {
        oldBudget?: { budgetId: string; currentSpent: number };
        newBudget?: { budgetId: string; currentSpent: number };
      } | undefined;

      // Eğer gider işlemi ise bütçe güncellemelerini hazırla
      if (oldTransaction.type === 'expense' || updatedFields.type === 'expense') {
        const oldDate = new Date(oldTransaction.date)
        const oldMonth = `${oldDate.getFullYear()}-${String(oldDate.getMonth() + 1).padStart(2, '0')}`
        const oldBudget = useBudgetStore.getState().getBudgetByCategory(oldTransaction.categoryId, oldMonth)

        // Yeni tarih veya kategori varsa yeni bütçeyi bul
        const newDate = updatedFields.date ? new Date(updatedFields.date) : oldDate
        const newMonth = `${newDate.getFullYear()}-${String(newDate.getMonth() + 1).padStart(2, '0')}`
        const newCategoryId = updatedFields.categoryId || oldTransaction.categoryId
        const newBudget = useBudgetStore.getState().getBudgetByCategory(newCategoryId, newMonth)

        budgetUpdates = {}

        // Eski bütçeden düş
        if (oldBudget && oldTransaction.type === 'expense') {
          budgetUpdates.oldBudget = {
            budgetId: oldBudget.id,
            currentSpent: Math.max(0, (oldBudget.spent || 0) - oldTransaction.amount)
          }
        }

        // Yeni bütçeye ekle
        if (newBudget && (updatedFields.type === 'expense' || (!('type' in updatedFields) && oldTransaction.type === 'expense'))) {
          const newAmount = updatedFields.amount !== undefined 
            ? Number(updatedFields.amount.toString().replace(/\./g, '').replace(/,/g, '.'))
            : oldTransaction.amount

          budgetUpdates.newBudget = {
            budgetId: newBudget.id,
            currentSpent: (newBudget.spent || 0) + newAmount
          }
        }
      }

      await FirestoreService.updateTransactionWithBudgetUpdate(id, updatedTransaction, budgetUpdates)
    } catch (error) {
      console.error('Error updating transaction:', error)
      throw error
    }
  },
}))

export default useTransactionStore