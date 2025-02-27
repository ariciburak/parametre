import { TransactionType } from '../constants/transactions'

export interface Transaction {
  id: string
  type: TransactionType
  amount: number
  categoryId: string
  date: Date
  description?: string
  createdAt: Date
  updatedAt: Date
}

export type Period = 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface TransactionFormValues {
  type: TransactionType
  amount: string
  categoryId: string
  date: Date
  description?: string
} 