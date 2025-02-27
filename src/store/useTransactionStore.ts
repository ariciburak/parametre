import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import type { Transaction, TransactionFormValues } from '../types/transaction'
import useBudgetStore from './useBudgetStore'

interface TransactionState {
  transactions: Transaction[]
  totalIncome: number
  totalExpense: number
  addTransaction: (transaction: TransactionFormValues) => void
  removeTransaction: (id: string) => void
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void
}

const useTransactionStore = create<TransactionState>()(
  persist(
    (set, get) => ({
      transactions: [],
      totalIncome: 0,
      totalExpense: 0,

      addTransaction: (formValues: TransactionFormValues) => {
        const transaction: Transaction = {
          id: Date.now().toString(),
          type: formValues.type,
          amount: formValues.amount ? Number(formValues.amount.replace(/\./g, '').replace(/,/g, '.')) : 0,
          categoryId: formValues.categoryId,
          date: formValues.date,
          description: formValues.description,
          createdAt: new Date(),
          updatedAt: new Date(),
        }

        set((state) => {
          const newTransactions = [...state.transactions, transaction].sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )

          const newTotalIncome =
            transaction.type === 'income'
              ? state.totalIncome + transaction.amount
              : state.totalIncome

          const newTotalExpense =
            transaction.type === 'expense'
              ? state.totalExpense + transaction.amount
              : state.totalExpense

          // Bütçe güncelleme
          if (transaction.type === 'expense') {
            const date = new Date(transaction.date)
            const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
            const budget = useBudgetStore.getState().getBudgetByCategory(transaction.categoryId, month)
            
            if (budget) {
              useBudgetStore.getState().updateBudget(budget.id, {
                spent: budget.spent + transaction.amount
              })
            }
          }

          return {
            transactions: newTransactions,
            totalIncome: newTotalIncome,
            totalExpense: newTotalExpense,
          }
        })
      },

      removeTransaction: (id: string) => {
        set((state) => {
          const transaction = state.transactions.find((t) => t.id === id)
          if (!transaction) return state

          const newTransactions = state.transactions.filter((t) => t.id !== id)
          const newTotalIncome =
            transaction.type === 'income'
              ? state.totalIncome - transaction.amount
              : state.totalIncome
          const newTotalExpense =
            transaction.type === 'expense'
              ? state.totalExpense - transaction.amount
              : state.totalExpense

          // Bütçe güncelleme
          if (transaction.type === 'expense') {
            const date = new Date(transaction.date)
            const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
            const budget = useBudgetStore.getState().getBudgetByCategory(transaction.categoryId, month)
            
            if (budget) {
              useBudgetStore.getState().updateBudget(budget.id, {
                spent: budget.spent - transaction.amount
              })
            }
          }

          return {
            transactions: newTransactions,
            totalIncome: newTotalIncome,
            totalExpense: newTotalExpense,
          }
        })
      },

      updateTransaction: (id: string, updatedFields: Partial<Transaction>) => {
        set((state) => {
          const oldTransaction = state.transactions.find((t) => t.id === id)
          if (!oldTransaction) return state

          let newTotalIncome = state.totalIncome
          let newTotalExpense = state.totalExpense

          const newTransactions = state.transactions.map((t) => {
            if (t.id !== id) return t

            const updatedTransaction = {
              ...t,
              ...updatedFields,
              updatedAt: new Date(),
            }

            if (updatedFields.amount || updatedFields.type) {
              // Remove old values
              if (oldTransaction.type === 'income') {
                newTotalIncome -= oldTransaction.amount
              } else {
                newTotalExpense -= oldTransaction.amount
              }

              // Add new values
              if (updatedTransaction.type === 'income') {
                newTotalIncome += updatedTransaction.amount
              } else {
                newTotalExpense += updatedTransaction.amount
              }
            }

            // Bütçe güncelleme
            if (oldTransaction.type === 'expense') {
              const date = new Date(oldTransaction.date)
              const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
              const budget = useBudgetStore.getState().getBudgetByCategory(oldTransaction.categoryId, month)
              
              if (budget) {
                // Eski tutarı çıkar
                useBudgetStore.getState().updateBudget(budget.id, {
                  spent: budget.spent - oldTransaction.amount
                })
              }
            }

            // Yeni işlem gider ise yeni tutarı ekle
            if (updatedTransaction.type === 'expense') {
              const date = new Date(updatedTransaction.date || oldTransaction.date)
              const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
              const categoryId = updatedTransaction.categoryId || oldTransaction.categoryId
              const amount = updatedTransaction.amount || oldTransaction.amount
              
              const budget = useBudgetStore.getState().getBudgetByCategory(categoryId, month)
              
              if (budget) {
                useBudgetStore.getState().updateBudget(budget.id, {
                  spent: budget.spent + amount
                })
              }
            }

            return updatedTransaction
          }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

          return {
            transactions: newTransactions,
            totalIncome: newTotalIncome,
            totalExpense: newTotalExpense,
          }
        })
      },
    }),
    {
      name: 'transaction-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
)

export default useTransactionStore