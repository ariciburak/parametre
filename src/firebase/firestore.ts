import { db, auth } from './config';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
  setDoc,
  writeBatch,
  DocumentData
} from 'firebase/firestore';
import type { Transaction } from '../types/transaction';
import type { Budget } from '../types/budget';

// Koleksiyon referansı al
const getCollectionRef = (collectionName: string) => {
  return collection(db, collectionName);
};

// Helper function to get user collection reference
const getUserCollection = (collectionName: string) => {
  const userId = auth.currentUser?.uid;
  if (!userId) throw new Error('User not authenticated');
  return collection(db, 'users', userId, collectionName);
};

// Yeni döküman ekle
export const addDocument = async (
  collectionName: string,
  data: DocumentData
): Promise<string> => {
  const docRef = await addDoc(getCollectionRef(collectionName), data);
  return docRef.id;
};

// Döküman güncelle
export const updateDocument = async (
  collectionName: string,
  documentId: string,
  data: Partial<DocumentData>
): Promise<void> => {
  const docRef = doc(db, collectionName, documentId);
  await updateDoc(docRef, data);
};

// Döküman sil
export const deleteDocument = async (
  collectionName: string,
  documentId: string
): Promise<void> => {
  const docRef = doc(db, collectionName, documentId);
  await deleteDoc(docRef);
};

// Koleksiyondaki tüm dökümanları getir
export const getAllDocuments = async (
  collectionName: string
): Promise<DocumentData[]> => {
  const querySnapshot = await getDocs(getCollectionRef(collectionName));
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

// Belirli bir sorguya göre dökümanları getir
export const queryDocuments = async (
  collectionName: string,
  field: string,
  operator: any,
  value: any
): Promise<DocumentData[]> => {
  const q = query(
    getCollectionRef(collectionName),
    where(field, operator, value)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

// Transactions
export const subscribeToTransactions = (
  onUpdate: (transactions: Transaction[]) => void,
  onError?: (error: Error) => void
) => {
  const userId = auth.currentUser?.uid;
  if (!userId) throw new Error('User not authenticated');

  const q = query(
    getUserCollection('transactions'),
    orderBy('date', 'desc')
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const transactions = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          date: data.date.toDate(),
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
        } as Transaction;
      });
      onUpdate(transactions);
    },
    (error) => {
      console.error('Error subscribing to transactions:', error);
      onError?.(error);
    }
  );
};

export const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
  const collectionRef = getUserCollection('transactions');
  const docRef = doc(collectionRef);

  await setDoc(docRef, {
    ...transaction,
    date: Timestamp.fromDate(transaction.date),
    createdAt: Timestamp.fromDate(transaction.createdAt),
    updatedAt: Timestamp.fromDate(transaction.updatedAt),
  });

  return docRef.id;
};

export const updateTransaction = async (id: string, transaction: Partial<Transaction>) => {
  const docRef = doc(getUserCollection('transactions'), id);
  const updateData: any = { ...transaction };

  if (transaction.date) {
    updateData.date = Timestamp.fromDate(transaction.date);
  }
  if (transaction.updatedAt) {
    updateData.updatedAt = Timestamp.fromDate(transaction.updatedAt);
  }

  await updateDoc(docRef, updateData);
};

export const deleteTransaction = async (id: string) => {
  const docRef = doc(getUserCollection('transactions'), id);
  await deleteDoc(docRef);
};

// Budgets
export const subscribeToBudgets = (
  onUpdate: (budgets: Budget[]) => void,
  onError?: (error: Error) => void
) => {
  const userId = auth.currentUser?.uid;
  if (!userId) throw new Error('User not authenticated');

  const q = query(getUserCollection('budgets'));

  return onSnapshot(
    q,
    (snapshot) => {
      const budgets = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          amount: Number(data.amount || 0),
          spent: Number(data.spent || 0),
          createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
          updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date(),
        } as Budget;
      });
      onUpdate(budgets);
    },
    (error) => {
      console.error('Error subscribing to budgets:', error);
      onError?.(error);
    }
  );
};

export const addBudget = async (budget: Omit<Budget, 'id'>) => {
  const collectionRef = getUserCollection('budgets');
  const docRef = doc(collectionRef);
  
  // Tarihleri Firestore Timestamp'e dönüştür
  const budgetData = {
    ...budget,
    createdAt: budget.createdAt instanceof Date ? Timestamp.fromDate(budget.createdAt) : budget.createdAt,
    updatedAt: budget.updatedAt instanceof Date ? Timestamp.fromDate(budget.updatedAt) : budget.updatedAt
  };
  
  await setDoc(docRef, budgetData);
  return docRef.id;
};

export const updateBudget = async (id: string, budget: Partial<Budget>) => {
  const docRef = doc(getUserCollection('budgets'), id);
  
  // Her zaman updatedAt alanını ekle
  const updateData = {
    ...budget,
    updatedAt: Timestamp.fromDate(new Date())
  };
  
  await updateDoc(docRef, updateData);
};

export const deleteBudget = async (id: string) => {
  const docRef = doc(getUserCollection('budgets'), id);
  await deleteDoc(docRef);
};

// Migration helper
export const migrateDataToFirestore = async (
  transactions: Transaction[],
  budgets: Budget[]
) => {
  const userId = auth.currentUser?.uid;
  if (!userId) throw new Error('User not authenticated');

  const batch = writeBatch(db);

  // Migrate transactions
  transactions.forEach((transaction) => {
    const docRef = doc(getUserCollection('transactions'));
    batch.set(docRef, {
      ...transaction,
      date: Timestamp.fromDate(transaction.date),
      createdAt: Timestamp.fromDate(transaction.createdAt),
      updatedAt: Timestamp.fromDate(transaction.updatedAt),
    });
  });

  // Migrate budgets
  budgets.forEach((budget) => {
    const docRef = doc(getUserCollection('budgets'));
    batch.set(docRef, budget);
  });

  await batch.commit();
};

export const addTransactionWithBudgetUpdate = async (
  transaction: Omit<Transaction, 'id'>,
  budgetUpdate?: { budgetId: string; currentSpent: number }
) => {
  const batch = writeBatch(db);
  
  // İşlem ekleme
  const transactionRef = doc(getUserCollection('transactions'));
  batch.set(transactionRef, {
    ...transaction,
    date: Timestamp.fromDate(transaction.date),
    createdAt: Timestamp.fromDate(transaction.createdAt),
    updatedAt: Timestamp.fromDate(transaction.updatedAt),
  });

  // Bütçe güncelleme
  if (budgetUpdate) {
    const budgetRef = doc(getUserCollection('budgets'), budgetUpdate.budgetId);
    batch.update(budgetRef, {
      spent: budgetUpdate.currentSpent,
      updatedAt: Timestamp.fromDate(new Date())
    });
  }

  await batch.commit();
  return transactionRef.id;
};

export const removeTransactionWithBudgetUpdate = async (
  transactionId: string,
  budgetUpdate?: { budgetId: string; currentSpent: number }
) => {
  const batch = writeBatch(db);
  
  // İşlemi sil
  const transactionRef = doc(getUserCollection('transactions'), transactionId);
  batch.delete(transactionRef);

  // Bütçe güncelleme
  if (budgetUpdate) {
    const budgetRef = doc(getUserCollection('budgets'), budgetUpdate.budgetId);
    batch.update(budgetRef, {
      spent: budgetUpdate.currentSpent,
      updatedAt: Timestamp.fromDate(new Date())
    });
  }

  await batch.commit();
};

export const updateTransactionWithBudgetUpdate = async (
  transactionId: string,
  transactionUpdate: Partial<Transaction>,
  budgetUpdates?: { 
    oldBudget?: { budgetId: string; currentSpent: number };
    newBudget?: { budgetId: string; currentSpent: number };
  }
) => {
  const batch = writeBatch(db);
  
  // İşlemi güncelle
  const transactionRef = doc(getUserCollection('transactions'), transactionId);
  const updateData: any = { ...transactionUpdate };

  if (transactionUpdate.date) {
    updateData.date = Timestamp.fromDate(transactionUpdate.date);
  }
  updateData.updatedAt = Timestamp.fromDate(new Date());
  
  batch.update(transactionRef, updateData);

  // Eski bütçeyi güncelle
  if (budgetUpdates?.oldBudget) {
    const oldBudgetRef = doc(getUserCollection('budgets'), budgetUpdates.oldBudget.budgetId);
    batch.update(oldBudgetRef, {
      spent: budgetUpdates.oldBudget.currentSpent,
      updatedAt: Timestamp.fromDate(new Date())
    });
  }

  // Yeni bütçeyi güncelle
  if (budgetUpdates?.newBudget) {
    const newBudgetRef = doc(getUserCollection('budgets'), budgetUpdates.newBudget.budgetId);
    batch.update(newBudgetRef, {
      spent: budgetUpdates.newBudget.currentSpent,
      updatedAt: Timestamp.fromDate(new Date())
    });
  }

  await batch.commit();
}; 