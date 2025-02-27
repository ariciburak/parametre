import { db } from './config';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  DocumentData
} from 'firebase/firestore';

// Koleksiyon referansı al
const getCollectionRef = (collectionName: string) => {
  return collection(db, collectionName);
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