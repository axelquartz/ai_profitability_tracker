import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc, 
  query, 
  where,
  orderBy 
} from 'firebase/firestore';
import { db } from './firebase';

// Revenue operations
export const addRevenue = async (revenueData) => {
  try {
    const docRef = await addDoc(collection(db, 'revenues'), {
      ...revenueData,
      timestamp: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding revenue: ', error);
    throw error;
  }
};

export const getRevenues = async () => {
  try {
    const q = query(
      collection(db, 'revenues'),
      orderBy('date', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting revenues: ', error);
    throw error;
  }
};

export const deleteRevenue = async (id) => {
  try {
    await deleteDoc(doc(db, 'revenues', id));
  } catch (error) {
    console.error('Error deleting revenue: ', error);
    throw error;
  }
};

// Expenses operations
export const addExpense = async (expenseData) => {
  try {
    const docRef = await addDoc(collection(db, 'expenses'), {
      ...expenseData,
      timestamp: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding expense: ', error);
    throw error;
  }
};

export const getExpenses = async () => {
  try {
    const q = query(
      collection(db, 'expenses'),
      orderBy('date', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting expenses: ', error);
    throw error;
  }
};

export const deleteExpense = async (id) => {
  try {
    await deleteDoc(doc(db, 'expenses', id));
  } catch (error) {
    console.error('Error deleting expense: ', error);
    throw error;
  }
}; 