import React, { useState, useEffect } from 'react';
import RevenueTracker from './revenue_tracker';
import ExpensesTracker from './expenses_tracker';
import ProfitabilitySummary from './ProfitabilitySummary';
import { DarkModeProvider } from './DarkModeContext';
import DarkModeToggle from './DarkModeToggle';
import { auth } from './firebase';

function App() {
  const [activeTracker, setActiveTracker] = useState('revenue');
  const [userId, setUserId] = useState(null);

  // In a real app, you would set userId after authentication
  // For now we'll use a hardcoded value for demonstration
  useEffect(() => {
    // This would normally come from auth.currentUser.uid
    setUserId('demo-user'); 
  }, []);

  if (!userId) {
    return <div>Loading user data...</div>;
  }

  return (
    <DarkModeProvider>
      <div className="app-container">
        <div className="header">
          <DarkModeToggle />
          <h1 className="main-title">Profitability Tracker</h1>
        </div>
        <div className="tracker-toggle">
          <button
            className={`toggle-button ${activeTracker === 'revenue' ? 'active' : ''}`}
            onClick={() => setActiveTracker('revenue')}
          >
            Revenue Tracker
          </button>
          <button
            className={`toggle-button ${activeTracker === 'expenses' ? 'active' : ''}`}
            onClick={() => setActiveTracker('expenses')}
          >
            Expenses Tracker
          </button>
        </div>

        <div className="tracker-section">
          {activeTracker === 'revenue' ? 
            <RevenueTracker userId={userId} /> : 
            <ExpensesTracker userId={userId} />}
        </div>

        <div className="summary-section">
          <ProfitabilitySummary userId={userId} />
        </div>
      </div>
    </DarkModeProvider>
  );
}

export default App;