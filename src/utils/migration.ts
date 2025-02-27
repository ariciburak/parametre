import AsyncStorage from '@react-native-async-storage/async-storage';
import { migrateDataToFirestore } from '../firebase/firestore';
import type { Transaction } from '../types/transaction';
import type { Budget } from '../types/budget';

interface StorageData {
  state: {
    transactions: Transaction[];
    totalIncome: number;
    totalExpense: number;
  };
}

interface BudgetStorageData {
  state: {
    budgets: Budget[];
  };
}

const convertDatesToObjects = (transactions: Transaction[]): Transaction[] => {
  return transactions.map(transaction => ({
    ...transaction,
    date: new Date(transaction.date),
    createdAt: new Date(transaction.createdAt),
    updatedAt: new Date(transaction.updatedAt),
  }));
};

export const migrateToFirestore = async () => {
  try {
    // Transaction verilerini al
    const transactionData = await AsyncStorage.getItem('transaction-storage');
    const budgetData = await AsyncStorage.getItem('budget-storage');

    if (!transactionData && !budgetData) {
      console.log('No local data to migrate');
      return;
    }

    let transactions: Transaction[] = [];
    let budgets: Budget[] = [];

    if (transactionData) {
      const parsedTransactionData = JSON.parse(transactionData) as StorageData;
      // Tarihleri Date nesnesine dönüştür
      transactions = convertDatesToObjects(parsedTransactionData.state.transactions);
    }

    if (budgetData) {
      const parsedBudgetData = JSON.parse(budgetData) as BudgetStorageData;
      budgets = parsedBudgetData.state.budgets;
    }

    // Verileri Firestore'a aktar
    await migrateDataToFirestore(transactions, budgets);

    // Migration başarılı olduktan sonra local verileri temizle
    await AsyncStorage.multiRemove(['transaction-storage', 'budget-storage']);

    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
}; 