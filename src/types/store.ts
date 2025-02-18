import { Transaction } from './transaction';

export interface StoreState {
  transactions: Transaction[];
  addTransaction: (transaction: Transaction) => void;
  removeTransaction: (id: string) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
} 