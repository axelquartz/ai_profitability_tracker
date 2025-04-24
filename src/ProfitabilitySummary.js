import React, { useState, useEffect } from 'react';
import { getRevenues, getExpenses } from './firebaseService';
import ProfitGrowthChart from './ProfitGrowthChart';
import ProfitabilityPercentageChart from './ProfitabilityPercentageChart';

function ProfitabilitySummary() {
  const [revenues, setRevenues] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [netProfit, setNetProfit] = useState(0);
  const [profitabilityPercentage, setProfitabilityPercentage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [revenueData, expenseData] = await Promise.all([
        getRevenues(),
        getExpenses()
      ]);
      
      setRevenues(revenueData);
      setExpenses(expenseData);

      // Calculate totals
      const revenueTotal = revenueData.reduce((sum, entry) => sum + Number(entry.revenue), 0);
      const expenseTotal = expenseData.reduce((sum, entry) => sum + Number(entry.expense), 0);
      const profit = revenueTotal - expenseTotal;

      setTotalRevenue(revenueTotal);
      setTotalExpenses(expenseTotal);
      setNetProfit(profit);
      setProfitabilityPercentage(revenueTotal > 0 ? (profit / revenueTotal) * 100 : 0);
      
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
          <p className="amount">${totalRevenue.toFixed(2)}</p>
        </div>
        <div className="summary-card expenses">
          <h3>Total Expenses</h3>
          <p className="amount">${totalExpenses.toFixed(2)}</p>
        </div>
        <div className={`summary-card profit ${netProfit >= 0 ? 'positive' : 'negative'}`}>
          <h3>Net Profit</h3>
          <p className="amount">${netProfit.toFixed(2)}</p>
        </div>
        <div className={`summary-card percentage ${profitabilityPercentage >= 0 ? 'positive' : 'negative'}`}>
          <h3>Profitability</h3>
          <p className="amount">{profitabilityPercentage.toFixed(1)}%</p>
        </div>
      </div>

      <div className="charts-grid">
        <ProfitGrowthChart />
        <ProfitabilityPercentageChart />
      </div>
    </div>
  );
}

export default ProfitabilitySummary; 