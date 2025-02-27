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

      await FirestoreService.addTransaction(transaction)

      // Bütçe güncelleme
      if (transaction.type === 'expense') {
        const date = new Date(transaction.date)
        const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        const budget = useBudgetStore.getState().getBudgetByCategory(transaction.categoryId, month)
        
        if (budget) {
          await FirestoreService.updateBudget(budget.id, {
            spent: budget.spent + transaction.amount
          })
        }
      }
    } catch (error) {
      console.error('Error adding transaction:', error)
      throw error
    }
  },

  removeTransaction: async (id: string) => {
    try {
      const transaction = get().transactions.find((t) => t.id === id)
      if (!transaction) return

      await FirestoreService.deleteTransaction(id)

      // Bütçe güncelleme
      if (transaction.type === 'expense') {
        const date = new Date(transaction.date)
        const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        const budget = useBudgetStore.getState().getBudgetByCategory(transaction.categoryId, month)
        
        if (budget) {
          await FirestoreService.updateBudget(budget.id, {
            spent: budget.spent - transaction.amount,
            updatedAt: new Date()
          })
        }
      }
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

      await FirestoreService.updateTransaction(id, updatedTransaction)

      // Bütçe güncelleme
      if (oldTransaction.type === 'expense') {
        const date = new Date(oldTransaction.date)
        const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        const budget = useBudgetStore.getState().getBudgetByCategory(oldTransaction.categoryId, month)
        
        if (budget) {
          await FirestoreService.updateBudget(budget.id, {
            spent: budget.spent - oldTransaction.amount
          })
        }
      }

      // Yeni işlem gider ise yeni tutarı ekle
      const newTransaction = { ...oldTransaction, ...updatedFields }
      if (newTransaction.type === 'expense') {
        const date = new Date(newTransaction.date)
        const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        const budget = useBudgetStore.getState().getBudgetByCategory(newTransaction.categoryId, month)
        
        if (budget) {
          await FirestoreService.updateBudget(budget.id, {
            spent: budget.spent + newTransaction.amount
          })
        }
      }
    } catch (error) {
      console.error('Error updating transaction:', error)
      throw error
    }
  },
}))

export default useTransactionStore