import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
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

export { db, auth }; 