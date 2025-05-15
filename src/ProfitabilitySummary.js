import React, { useState, useEffect } from 'react';
import { getSales, getExpenses, calculateMonthlySummary } from './firebaseService';
import ProfitGrowthChart from './ProfitGrowthChart';
import ProfitabilityPercentageChart from './ProfitabilityPercentageChart';

function ProfitabilitySummary({ userId }) {
  const [summary, setSummary] = useState({
    totalRevenue: 0,
    totalExpenses: 0,
    netProfit: 0,
    profitabilityPercentage: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, [userId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const currentDate = new Date();
      const monthYear = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
      
      const monthlySummary = await calculateMonthlySummary(userId, monthYear);
      
      setSummary({
        totalRevenue: monthlySummary.totalRevenue,
        totalExpenses: monthlySummary.totalExpenses,
        netProfit: monthlySummary.totalProfit,
        profitabilityPercentage: monthlySummary.totalRevenue > 0 ? 
          (monthlySummary.totalProfit / monthlySummary.totalRevenue) * 100 : 0
      });
      
      setError(null);
    } catch (err) {
      setError('Failed to load data');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading summary data...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="profitability-summary">
      <h2>Profitability Summary</h2>
      <div className="summary-grid">
        <div className="summary-card revenue">
          <h3>Total Revenue</h3>
          <p className="amount">${summary.totalRevenue.toFixed(2)}</p>
        </div>
        <div className="summary-card expenses">
          <h3>Total Expenses</h3>
          <p className="amount">${summary.totalExpenses.toFixed(2)}</p>
        </div>
        <div className={`summary-card profit ${summary.netProfit >= 0 ? 'positive' : 'negative'}`}>
          <h3>Net Profit</h3>
          <p className="amount">${summary.netProfit.toFixed(2)}</p>
        </div>
        <div className={`summary-card percentage ${summary.profitabilityPercentage >= 0 ? 'positive' : 'negative'}`}>
          <h3>Profitability</h3>
          <p className="amount">{summary.profitabilityPercentage.toFixed(1)}%</p>
        </div>
      </div>

      <div className="charts-grid">
        <ProfitGrowthChart userId={userId} />
        <ProfitabilityPercentageChart userId={userId} />
      </div>
    </div>
  );
}

export default ProfitabilitySummary;