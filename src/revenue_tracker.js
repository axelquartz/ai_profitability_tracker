import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { addRevenue, getRevenues, deleteRevenue } from './firebaseService';

function RevenueTracker() {
  const [revenues, setRevenues] = useState([]);
  const [newRevenue, setNewRevenue] = useState('');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadRevenues();
  }, []);

  const loadRevenues = async () => {
    try {
      setLoading(true);
      const revenueData = await getRevenues();
      setRevenues(revenueData);
      setError(null);
    } catch (err) {
      setError('Failed to load revenues');
      console.error('Error loading revenues:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newRevenue) return;

    try {
      const newEntry = {
        revenue: Number(newRevenue),
        date: date,
      };

      await addRevenue(newEntry);
      await loadRevenues(); // Reload the data
      setNewRevenue('');
      setError(null);
    } catch (err) {
      setError('Failed to add revenue');
      console.error('Error adding revenue:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteRevenue(id);
      await loadRevenues(); // Reload the data
      setError(null);
    } catch (err) {
      setError('Failed to delete revenue');
      console.error('Error deleting revenue:', err);
    }
  };

  if (loading) {
    return <div className="loading">Loading revenues...</div>;
  }

  return (
    <div className="app">
      <h1>Revenue Tracker</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="input-form">
        <div className="form-group">
          <label htmlFor="revenue">Revenue Amount:</label>
          <input
            type="number"
            id="revenue"
            value={newRevenue}
            onChange={(e) => setNewRevenue(e.target.value)}
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
        <h2>Revenue Entries</h2>
        {revenues.length === 0 ? (
          <p>No entries yet. Add your first revenue entry above!</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Revenue</th>
                <th>Time Added</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {revenues.map((entry) => (
                <tr key={entry.id}>
                  <td>{entry.date}</td>
                  <td>${entry.revenue}</td>
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

export default RevenueTracker; 