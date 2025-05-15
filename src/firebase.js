import { initializeApp } from 'firebase/app';
import { getFirestore, addDoc, collection, doc, getDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB7OdtOnjkJhVWA0nzqLHk-wZgw9QxvwWo",
    authDomain: "ai-profitability-tracker.firebaseapp.com",
    projectId: "ai-profitability-tracker",
    storageBucket: "ai-profitability-tracker.firebasestorage.app",
    messagingSenderId: "338708502170",
    appId: "1:338708502170:web:b764e091021d8b34ecb123"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Firestore Utilities
export const addProduct = async (userId, productData) => {
  const docRef = await addDoc(collection(db, `users/${userId}/products`), {
    ...productData,
    createdAt: serverTimestamp()
  });
  return docRef.id;
};

export const recordSale = async (userId, saleData) => {
  const { productId, quantity } = saleData;
  const productDoc = await getDoc(doc(db, `users/${userId}/products/${productId}`));
  const product = productDoc.data();
  
  const totalProfit = (product.price - product.cost) * quantity;
  
  const docRef = await addDoc(collection(db, `users/${userId}/sales`), {
    ...saleData,
    totalProfit,
    date: serverTimestamp()
  });
  return docRef.id;
};

export const getMonthlySummary = async (userId, monthYear) => {
  const docRef = doc(db, `users/${userId}/summaries/${monthYear}`);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : null;
};

// Add more utility functions as needed

export { db, auth };