import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { getRevenues, getExpenses } from './firebaseService';
import { format, subDays, subMonths, subYears, startOfDay, endOfDay } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function ProfitGrowthChart() {
  const [timeFilter, setTimeFilter] = useState('week');
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, [timeFilter]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [revenues, expenses] = await Promise.all([
        getRevenues(),
        getExpenses()
      ]);

      const data = processData(revenues, expenses);
      setChartData(data);
      setError(null);
    } catch (err) {
      setError('Failed to load chart data');
      console.error('Error loading chart data:', err);
    } finally {
      setLoading(false);
    }
  };

  const processData = (revenues, expenses) => {
    const now = new Date();
    let startDate;
    let dateFormat;

    switch (timeFilter) {
      case 'week':
        startDate = subDays(now, 7);
        dateFormat = 'MMM dd';
        break;
      case 'month':
        startDate = subMonths(now, 1);
        dateFormat = 'MMM dd';
        break;
      case 'year':
        startDate = subYears(now, 1);
        dateFormat = 'MMM yyyy';
        break;
      default:
        startDate = subDays(now, 7);
        dateFormat = 'MMM dd';
    }

    // Create date range
    const dates = [];
    let currentDate = startDate;
    while (currentDate <= now) {
      dates.push(format(currentDate, dateFormat));
      currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
    }

    // Calculate daily profits
    const dailyProfits = dates.map(date => {
      const dayRevenues = revenues.filter(r => 
        format(new Date(r.date), dateFormat) === date
      ).reduce((sum, r) => sum + Number(r.revenue), 0);

      const dayExpenses = expenses.filter(e => 
        format(new Date(e.date), dateFormat) === date
      ).reduce((sum, e) => sum + Number(e.expense), 0);

      return dayRevenues - dayExpenses;
    });

    // Calculate cumulative profits
    const cumulativeProfits = dailyProfits.reduce((acc, profit, index) => {
      const previousTotal = index === 0 ? 0 : acc[index - 1];
      acc.push(previousTotal + profit);
      return acc;
    }, []);

    return {
      labels: dates,
      datasets: [
        {
          label: 'Cumulative Profit',
          data: cumulativeProfits,
          borderColor: '#27ae60',
          backgroundColor: 'rgba(39, 174, 96, 0.1)',
          tension: 0.4,
          fill: true,
        },
      ],
    };
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          boxWidth: 12,
          padding: 15,
          font: {
            size: window.innerWidth < 768 ? 11 : 12
          }
        }
      },
      title: {
        display: true,
        text: 'Profit Growth Over Time',
        font: {
          size: window.innerWidth < 768 ? 14 : 16
        },
        padding: {
          bottom: window.innerWidth < 768 ? 10 : 20
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        padding: 10,
        titleFont: {
          size: window.innerWidth < 768 ? 11 : 12
        },
        bodyFont: {
          size: window.innerWidth < 768 ? 11 : 12
        }
      }
    },
    scales: {
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 45,
          font: {
            size: window.innerWidth < 768 ? 10 : 11
          },
          maxTicksLimit: window.innerWidth < 768 ? 5 : 8
        },
        grid: {
          display: false
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `$${value}`,
          font: {
            size: window.innerWidth < 768 ? 10 : 11
          },
          maxTicksLimit: window.innerWidth < 768 ? 5 : 8
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    }
  };

  if (loading) {
    return <div className="loading">Loading chart data...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="profit-growth-chart">
      <div className="chart-filters">
        <button
          className={`filter-button ${timeFilter === 'week' ? 'active' : ''}`}
          onClick={() => setTimeFilter('week')}
        >
          Week
        </button>
        <button
          className={`filter-button ${timeFilter === 'month' ? 'active' : ''}`}
          onClick={() => setTimeFilter('month')}
        >
          Month
        </button>
        <button
          className={`filter-button ${timeFilter === 'year' ? 'active' : ''}`}
          onClick={() => setTimeFilter('year')}
        >
          Year
        </button>
      </div>
      <div className="chart-container">
        {chartData && <Line data={chartData} options={options} />}
      </div>
    </div>
  );
}

export default ProfitGrowthChart; 