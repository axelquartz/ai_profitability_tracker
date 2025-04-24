import React, { useState } from 'react';
import RevenueTracker from './revenue_tracker';
import ExpensesTracker from './expenses_tracker';
import ProfitabilitySummary from './ProfitabilitySummary';
import { DarkModeProvider } from './DarkModeContext';
import DarkModeToggle from './DarkModeToggle';

function App() {
  const [activeTracker, setActiveTracker] = useState('revenue');

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
          {activeTracker === 'revenue' ? <RevenueTracker /> : <ExpensesTracker />}
        </div>

        <div className="summary-section">
          <ProfitabilitySummary />
        </div>
      </div>
    </DarkModeProvider>
  );
}

export default App; 