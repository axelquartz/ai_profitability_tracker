import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { getSales, getExpenses } from './firebaseService';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function ProfitGrowthChart({ userId }) {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Profit',
        data: [],
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
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

        // Group by month and calculate profit
        const monthlyData = {};
        
        sales.forEach(sale => {
          const date = new Date(sale.date);
          const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          monthlyData[monthYear] = monthlyData[monthYear] || { revenue: 0, expenses: 0 };
          monthlyData[monthYear].revenue += sale.totalProfit;
        });
        
        expenses.forEach(expense => {
          const date = new Date(expense.date);
          const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          monthlyData[monthYear] = monthlyData[monthYear] || { revenue: 0, expenses: 0 };
          monthlyData[monthYear].expenses += expense.amount;
        });

        const labels = Object.keys(monthlyData).sort();
        const profitData = labels.map(month => {
          return monthlyData[month].revenue - monthlyData[month].expenses;
        });

        setChartData({
          labels,
          datasets: [
            {
              ...chartData.datasets[0],
              data: profitData,
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
      <h3>Monthly Profit Growth</h3>
      <Bar 
        data={chartData} 
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
          },
        }} 
      />
    </div>
  );
}

export default ProfitGrowthChart;