import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc, 
  query, 
  where,
  orderBy,
  setDoc,
  getDoc
} from 'firebase/firestore';
import { db, auth } from './firebase';

// Get current user ID or use a default one if not logged in
const getCurrentUserId = () => {
  const currentUser = auth.currentUser;
  return currentUser ? currentUser.uid : 'default_user';
};

// Revenue operations
export const addRevenue = async (revenueData) => {
  try {
    const userId = getCurrentUserId();
    const userDocRef = doc(db, 'users', userId);
    
    // Ensure the user document exists
    const userDoc = await getDoc(userDocRef);
    if (!userDoc.exists()) {
      await setDoc(userDocRef, { email: auth.currentUser?.email || 'default@example.com' });
    }
    
    const docRef = await addDoc(collection(db, 'users', userId, 'revenues'), {
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
    const userId = getCurrentUserId();
    const q = query(
      collection(db, 'users', userId, 'revenues'),
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
    const userId = getCurrentUserId();
    await deleteDoc(doc(db, 'users', userId, 'revenues', id));
  } catch (error) {
    console.error('Error deleting revenue: ', error);
    throw error;
  }
};

// Expenses operations
export const addExpense = async (expenseData) => {
  try {
    const userId = getCurrentUserId();
    const userDocRef = doc(db, 'users', userId);
    
    // Ensure the user document exists
    const userDoc = await getDoc(userDocRef);
    if (!userDoc.exists()) {
      await setDoc(userDocRef, { email: auth.currentUser?.email || 'default@example.com' });
    }
    
    const docRef = await addDoc(collection(db, 'users', userId, 'expenses'), {
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
    const userId = getCurrentUserId();
    const q = query(
      collection(db, 'users', userId, 'expenses'),
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
    const userId = getCurrentUserId();
    await deleteDoc(doc(db, 'users', userId, 'expenses', id));
  } catch (error) {
    console.error('Error deleting expense: ', error);
    throw error;
  }
};