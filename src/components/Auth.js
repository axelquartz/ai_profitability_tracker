import React, { useState } from 'react';
import { signInWithEmail, signUpWithEmail, signInWithGoogle, signOutUser } from '../utils/authUtils';
import GoogleButton from './GoogleButton';

function Auth({ user, setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState(null);

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError(null);
    
    const result = isSignUp 
      ? await signUpWithEmail(email, password)
      : await signInWithEmail(email, password);
    
    if (!result.success) {
      setError(result.error);
      console.error('Authentication error:', result.error);
    }
  };

  const handleGoogleAuth = async () => {
    setError(null);
    
    const result = await signInWithGoogle();
    
    if (!result.success) {
      setError(result.error);
      console.error('Google authentication error:', result.error);
    }
  };

  const handleSignOut = async () => {
    const result = await signOutUser();
    
    if (!result.success) {
      console.error('Sign out error:', result.error);
    }
  };

  if (user) {
    return (
      <div className="auth-container">
        <div className="user-info">
          <p>Signed in as: {user.email}</p>
          <button onClick={handleSignOut} className="sign-out-btn">Sign Out</button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <h2>{isSignUp ? 'Sign Up' : 'Sign In'}</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleEmailAuth} className="auth-form">
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <button type="submit" className="auth-btn">
          {isSignUp ? 'Sign Up' : 'Sign In'} with Email
        </button>
      </form>
      
      <GoogleButton onClick={handleGoogleAuth} />
      
      <p className="auth-toggle">
        {isSignUp 
          ? 'Already have an account? ' 
          : 'Don\'t have an account? '}
        <button 
          onClick={() => setIsSignUp(!isSignUp)}
          className="toggle-btn"
        >
          {isSignUp ? 'Sign In' : 'Sign Up'}
        </button>
      </p>
    </div>
  );
}

export default Auth;
