import { TransactionType } from '../constants/transactions'

export interface Transaction {
  id: string
  type: TransactionType
  amount: number
  categoryId: string
  date: Date
  description?: string
  photoUrl?: string
  createdAt: Date
  updatedAt: Date
}

export interface TransactionFormValues {
  type: TransactionType
  amount: string
  categoryId: string
  date: Date
  description?: string
  photo?: {
    uri: string
    type: string
    name: string
  }
} 