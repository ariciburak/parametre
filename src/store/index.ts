import { create } from 'zustand';
import { Transaction } from '../types/transaction';

interface StoreState {
  transactions: Transaction[];
  addTransaction: (transaction: Transaction) => void;
  removeTransaction: (id: string) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
}

export const useStore = create<StoreState>((set) => ({
  transactions: [],
  addTransaction: (transaction) =>
    set((state) => ({
      transactions: [...state.transactions, transaction],
    })),
  removeTransaction: (id) =>
    set((state) => ({
      transactions: state.transactions.filter((t) => t.id !== id),
    })),
  updateTransaction: (id, transaction) =>
    set((state) => ({
      transactions: state.transactions.map((t) =>
        t.id === id ? { ...t, ...transaction } : t
      ),
    })),
})); 