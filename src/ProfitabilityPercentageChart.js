import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { getSales, getExpenses } from './firebaseService';

ChartJS.register(ArcElement, Tooltip, Legend);

function ProfitabilityPercentageChart({ userId }) {
  const [chartData, setChartData] = useState({
    labels: ['Revenue', 'Expenses'],
    datasets: [
      {
        label: 'Amount',
        data: [0, 0],
        backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(255, 99, 132, 0.2)'],
        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
        borderWidth: 1,
      },
    ],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sales, expenses] = await Promise.all([
          getSales(userId),
          getExpenses(userId)
        ]);

        const revenue = sales.reduce((sum, sale) => sum + sale.totalProfit, 0);
        const expenseTotal = expenses.reduce((sum, expense) => sum + expense.amount, 0);

        setChartData({
          ...chartData,
          datasets: [
            {
              ...chartData.datasets[0],
              data: [revenue, expenseTotal],
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    };

    fetchData();
  }, [userId]);

  return (
    <div className="chart-container">
      <h3>Revenue vs Expenses</h3>
      <Pie data={chartData} />
    </div>
  );
}

export default ProfitabilityPercentageChart;