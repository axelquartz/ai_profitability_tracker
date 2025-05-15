import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import RevenueTracker from './revenue_tracker';
import ExpensesTracker from './expenses_tracker';
import ProfitabilitySummary from './ProfitabilitySummary';
import { DarkModeProvider } from './DarkModeContext';
import DarkModeToggle from './DarkModeToggle';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Auth from './components/Auth';
import Login from './components/Login';
import PrivateRoute from './components/PrivateRoute';

// Dashboard component that contains the main app functionality
function Dashboard() {
  const [activeTracker, setActiveTracker] = useState('revenue');
  const { currentUser } = useAuth();

  return (
    <div className="app-container">
      <div className="header">
        <DarkModeToggle />
        <h1 className="main-title">Profitability Tracker</h1>
        <div className="user-section">
          <Auth user={currentUser} />
        </div>
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
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <DarkModeProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </DarkModeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;