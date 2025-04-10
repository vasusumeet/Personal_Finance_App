import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../UserContext';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SavingsProgress = () => {
  const { user } = useContext(UserContext);
  const [savingsData, setSavingsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user || !user._id) return;
      
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5555/api/userdata/${user._id}`);
        const userData = response.data;
        
        setSavingsData(userData.savingsGoals || []);
      } catch (error) {
        console.error('Error fetching savings data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const options = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        beginAtZero: true,
        max: Math.max(...savingsData.map(goal => goal.targetAmount), 1000),
        title: {
          display: true,
          text: 'Amount'
        }
      }
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Savings Goals Progress',
      },
    },
  };

  const data = {
    labels: savingsData.map(goal => goal.goalName),
    datasets: [
      {
        label: 'Current Amount',
        data: savingsData.map(goal => goal.currentAmount),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
      {
        label: 'Target Amount',
        data: savingsData.map(goal => goal.targetAmount),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
      },
    ],
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Savings Goals Progress</h3>
      {loading ? (
        <div className="flex justify-center items-center h-64">Loading data...</div>
      ) : savingsData.length > 0 ? (
        <div className="">
          <Bar options={options} data={data} />
        </div>
      ) : (
        <div className="flex justify-center items-center h-64">No savings goals available</div>
      )}
    </div>
  );
};

export default SavingsProgress;