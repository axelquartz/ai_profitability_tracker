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
import { format, subDays, subMonths, subYears } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function ProfitabilityPercentageChart() {
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

    // Calculate daily profitability percentages
    const dailyPercentages = dates.map(date => {
      const dayRevenues = revenues.filter(r => 
        format(new Date(r.date), dateFormat) === date
      ).reduce((sum, r) => sum + Number(r.revenue), 0);

      const dayExpenses = expenses.filter(e => 
        format(new Date(e.date), dateFormat) === date
      ).reduce((sum, e) => sum + Number(e.expense), 0);

      const dayProfit = dayRevenues - dayExpenses;
      return dayRevenues > 0 ? (dayProfit / dayRevenues) * 100 : 0;
    });

    // Calculate moving average (7-day for week/month view, 30-day for year view)
    const windowSize = timeFilter === 'year' ? 30 : 7;
    const movingAverages = dailyPercentages.map((_, index) => {
      const start = Math.max(0, index - windowSize + 1);
      const values = dailyPercentages.slice(start, index + 1);
      return values.reduce((sum, val) => sum + val, 0) / values.length;
    });

    return {
      labels: dates,
      datasets: [
        {
          label: 'Daily Profitability',
          data: dailyPercentages,
          borderColor: '#3498db',
          backgroundColor: 'rgba(52, 152, 219, 0.1)',
          tension: 0.4,
          fill: true,
        },
        {
          label: 'Moving Average',
          data: movingAverages,
          borderColor: '#e74c3c',
          backgroundColor: 'rgba(231, 76, 60, 0.1)',
          tension: 0.4,
          fill: false,
          borderDash: [5, 5],
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
        text: 'Profitability Percentage Over Time',
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
          callback: (value) => `${value}%`,
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
    <div className="profitability-percentage-chart">
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

export default ProfitabilityPercentageChart; 