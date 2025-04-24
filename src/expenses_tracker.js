import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { addExpense, getExpenses, deleteExpense } from './firebaseService';

function ExpensesTracker() {
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState('');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    try {
      setLoading(true);
      const expenseData = await getExpenses();
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
    if (!newExpense) return;

    try {
      const newEntry = {
        expense: Number(newExpense),
        date: date,
      };

      await addExpense(newEntry);
      await loadExpenses(); // Reload the data
      setNewExpense('');
      setError(null);
    } catch (err) {
      setError('Failed to add expense');
      console.error('Error adding expense:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteExpense(id);
      await loadExpenses(); // Reload the data
      setError(null);
    } catch (err) {
      setError('Failed to delete expense');
      console.error('Error deleting expense:', err);
    }
  };

  if (loading) {
    return <div className="loading">Loading expenses...</div>;
  }

  return (
    <div className="app">
      <h1>Expenses Tracker</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="input-form">
        <div className="form-group">
          <label htmlFor="expense">Expense Amount:</label>
          <input
            type="number"
            id="expense"
            value={newExpense}
            onChange={(e) => setNewExpense(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="date">Date:</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        
        <button type="submit">Add Entry</button>
      </form>

      <div className="entries-list">
        <h2>Expense Entries</h2>
        {expenses.length === 0 ? (
          <p>No entries yet. Add your first expense entry above!</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Expense</th>
                <th>Time Added</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((entry) => (
                <tr key={entry.id}>
                  <td>{entry.date}</td>
                  <td>${entry.expense}</td>
                  <td>{new Date(entry.timestamp).toLocaleTimeString()}</td>
                  <td>
                    <button onClick={() => handleDelete(entry.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default ExpensesTracker; 