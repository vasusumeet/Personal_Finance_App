import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { UserContext } from '../UserContext';

ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend
);

const MonthlyExpensesTrend = () => {
  const { user } = useContext(UserContext);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user || !user.id) return;
      
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No auth token found. Please login again.');
          setLoading(false);
          return;
        }
        const response = await axios.get(`http://localhost:5555/api/userdata/${user.id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const userData = response.data;
        
        // Group expenses by month
        const monthlyData = {};
        
        (userData.expenses || []).forEach(expense => {
          const date = new Date(expense.date);
          const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
          
          if (monthlyData[monthYear]) {
            monthlyData[monthYear] += expense.amount;
          } else {
            monthlyData[monthYear] = expense.amount;
          }
        });
        
        // Sort months chronologically
        const sortedMonths = Object.keys(monthlyData).sort((a, b) => {
          const [aMonth, aYear] = a.split('/').map(Number);
          const [bMonth, bYear] = b.split('/').map(Number);
          
          return aYear === bYear ? aMonth - bMonth : aYear - bYear;
        });
        
        setChartData({
          labels: sortedMonths,
          datasets: [
            {
              label: 'Monthly Expenses',
              data: sortedMonths.map(month => monthlyData[month]),
              borderColor: 'rgb(75, 192, 192)',
              backgroundColor: 'rgba(75, 192, 192, 0.5)',
              tension: 0.2,
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching expense data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly Expenses Trend',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Amount'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Month/Year'
        }
      }
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Monthly Expense Trend</h3>
      {loading ? (
        <div className="flex justify-center items-center">Loading data...</div>
      ) : chartData.labels.length > 0 ? (
        <div className="h-64">
          <Line data={chartData} options={options} />
        </div>
      ) : (
        <div className="flex justify-center items-center">No expense data available</div>
      )}
    </div>
  );
};

export default MonthlyExpensesTrend;
