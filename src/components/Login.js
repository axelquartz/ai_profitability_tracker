import React from 'react';
import { Navigate } from 'react-router-dom';
import Auth from './Auth';
import { useAuth } from '../contexts/AuthContext';

function Login() {
  const { currentUser } = useAuth();

  // If user is already logged in, redirect to dashboard
  if (currentUser) {
    return <Navigate to="/" />;
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <h1>AI Profitability Tracker</h1>
        <p>Sign in to track your revenues and expenses</p>
        <Auth user={currentUser} />
      </div>
    </div>
  );
}

export default Login;
