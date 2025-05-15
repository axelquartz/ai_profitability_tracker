import { db } from './firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc, 
  query, 
  where,
  getDoc
} from 'firebase/firestore';

// Product operations
export const addProduct = async (userId, productData) => {
  try {
    const docRef = await addDoc(collection(db, `users/${userId}/products`), {
      ...productData,
      createdAt: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding product: ', error);
    throw error;
  }
};

export const getProducts = async (userId) => {
  try {
    const querySnapshot = await getDocs(collection(db, `users/${userId}/products`));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting products: ', error);
    throw error;
  }
};

// Sales operations
export const recordSale = async (userId, saleData) => {
  try {
    const productDoc = await getDoc(doc(db, `users/${userId}/products/${saleData.productId}`));
    const product = productDoc.data();
    
    const totalProfit = (product.price - product.cost) * saleData.quantity;
    
    const docRef = await addDoc(collection(db, `users/${userId}/sales`), {
      ...saleData,
      totalProfit,
      date: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error recording sale: ', error);
    throw error;
  }
};

export const getSales = async (userId) => {
  try {
    const querySnapshot = await getDocs(collection(db, `users/${userId}/sales`));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting sales: ', error);
    throw error;
  }
};

// Expenses operations
export const addExpense = async (userId, expenseData) => {
  try {
    const docRef = await addDoc(collection(db, `users/${userId}/expenses`), {
      ...expenseData,
      date: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding expense: ', error);
    throw error;
  }
};

export const getExpenses = async (userId) => {
  try {
    const querySnapshot = await getDocs(collection(db, `users/${userId}/expenses`));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting expenses: ', error);
    throw error;
  }
};

// Summary operations
export const calculateMonthlySummary = async (userId, monthYear) => {
  try {
    const [sales, expenses] = await Promise.all([
      getSales(userId),
      getExpenses(userId)
    ]);
    
    const filteredSales = sales.filter(sale => sale.date.startsWith(monthYear));
    const filteredExpenses = expenses.filter(expense => expense.date.startsWith(monthYear));
    
    const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.totalProfit, 0);
    const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const totalProfit = totalRevenue - totalExpenses;
    
    return {
      totalRevenue,
      totalExpenses,
      totalProfit,
      createdAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error calculating monthly summary: ', error);
    throw error;
  }
};