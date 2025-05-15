import React, { useState, useEffect } from 'react';
import { addExpense, getExpenses } from './firebaseService';

function ExpensesTracker({ userId }) {
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({
    name: '',
    amount: 0,
    category: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadExpenses();
  }, [userId]);

  const loadExpenses = async () => {
    try {
      setLoading(true);
      const expenseData = await getExpenses(userId);
      setExpenses(expenseData);
      setError(null);
    } catch (err) {
      setError('Failed to load expenses');
      console.error('Error loading expenses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newExpense.name || !newExpense.amount) return;

    try {
      await addExpense(userId, newExpense);
      await loadExpenses();
      setNewExpense({ name: '', amount: 0, category: '' });
    } catch (err) {
      setError('Failed to add expense');
      console.error('Error adding expense:', err);
    }
  };

  if (loading) {
    return <div className="loading">Loading expenses...</div>;
  }

  return (
    <div className="expenses-tracker">
      <h1>Expenses Tracker</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="input-form">
        <h2>Add Expense</h2>
        <div className="form-group">
          <label>Expense Name:</label>
          <input
            type="text"
            value={newExpense.name}
            onChange={(e) => setNewExpense({...newExpense, name: e.target.value})}
            required
          />
        </div>
        <div className="form-group">
          <label>Amount:</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={newExpense.amount}
            onChange={(e) => setNewExpense({...newExpense, amount: Number(e.target.value)})}
            required
          />
        </div>
        <div className="form-group">
          <label>Category:</label>
          <input
            type="text"
            value={newExpense.category}
            onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
          />
        </div>
        <button type="submit">Add Expense</button>
      </form>

      <div className="expenses-list">
        <h2>Recent Expenses</h2>
        {expenses.length === 0 ? (
          <p>No expenses yet</p>
        ) : (
          <ul>
            {expenses.slice(0, 10).map(expense => (
              <li key={expense.id}>
                {expense.name} - ${expense.amount} {expense.category && `(${expense.category})`}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default ExpensesTracker;