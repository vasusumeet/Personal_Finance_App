import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { UserContext } from '../UserContext';

ChartJS.register(ArcElement, Tooltip, Legend);

const ExpensesByCategory = () => {
  const { user } = useContext(UserContext);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [],
      },
    ],
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
        const response = await axios.get(`https://personalfinanceapp-production-3551.up.railway.app/api/userdata/${user.id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const userData = response.data;
        
        // Process expenses by category
        const categories = {};
        (userData.expenses || []).forEach(expense => {
          if (categories[expense.category]) {
            categories[expense.category] += expense.amount;
          } else {
            categories[expense.category] = expense.amount;
          }
        });
        
        // Generate colors
        const backgroundColors = [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', 
          '#FF9F40', '#8AC926', '#6A4C93', '#1982C4', '#FFCA3A'
        ];
        
        setChartData({
          labels: Object.keys(categories),
          datasets: [
            {
              label: 'Expenses by Category',
              data: Object.values(categories),
              backgroundColor: backgroundColors.slice(0, Object.keys(categories).length),
              borderWidth: 1,
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
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: true,
        text: 'Expenses by Category',
        font: {
          size: 16,
        },
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Expense Distribution</h3>
      {loading ? (
        <div className="flex justify-center items-center">Loading data...</div>
      ) : chartData.labels.length > 0 ? (
        <div className="">
          <Pie data={chartData} options={options} />
        </div>
      ) : (
        <div className="flex justify-center items-center h-64">No expense data available</div>
      )}
    </div>
  );
};

export default ExpensesByCategory;
