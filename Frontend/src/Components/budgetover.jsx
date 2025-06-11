import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../UserContext';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BudgetOverview = () => {
  const { user } = useContext(UserContext);
  const [budgetData, setBudgetData] = useState({
    salary: 0,
    totalExpenses: 0
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
        
        // Calculate total expenses for current month
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();
        
        const monthlyExpenses = (userData.expenses || [])
          .filter(expense => {
            const expenseDate = new Date(expense.date);
            return expenseDate.getMonth() === currentMonth && 
                   expenseDate.getFullYear() === currentYear;
          })
          .reduce((total, expense) => total + expense.amount, 0);
        
        const monthlyIncome = (userData.income || [])
          .filter(income => {
            const incomeDate = new Date(income.date);
            return incomeDate.getMonth() === currentMonth && 
                   incomeDate.getFullYear() === currentYear;
          })
          .reduce((total, income) => total + income.amount, 0);
        
        setBudgetData({
          salary: (userData.recurringSalary || userData.salary || 0) + monthlyIncome,
          totalExpenses: monthlyExpenses
        });
      } catch (error) {
        console.error('Error fetching budget data:', error);
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
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly Budget Overview',
      },
    },
  };

  const data = {
    labels: ['Income vs Expenses'],
    datasets: [
      {
        label: 'Income',
        data: [budgetData.salary],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
      {
        label: 'Expenses',
        data: [budgetData.totalExpenses],
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
    ],
  };

  const remainingBudget = budgetData.salary - budgetData.totalExpenses;
  const percentUsed = budgetData.salary > 0 ? 
    Math.round((budgetData.totalExpenses / budgetData.salary) * 100) : 0;

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Monthly Budget Overview</h3>
      {loading ? (
        <div className="flex justify-center items-center h-64">Loading data...</div>
      ) : (
        <>
          <div className="mb-4">
            <Bar options={options} data={data} />
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-2 bg-blue-50 rounded">
              <p className="text-sm text-gray-500">Income</p>
              <p className="text-lg font-semibold">₹{budgetData.salary.toFixed(2)}</p>
            </div>
            <div className="p-2 bg-red-50 rounded">
              <p className="text-sm text-gray-500">Expenses</p>
              <p className="text-lg font-semibold">₹{budgetData.totalExpenses.toFixed(2)}</p>
            </div>
            <div className={`p-2 ${remainingBudget >= 0 ? 'bg-green-50' : 'bg-red-50'} rounded`}>
              <p className="text-sm text-gray-500">Remaining</p>
              <p className="text-lg font-semibold">₹{remainingBudget.toFixed(2)}</p>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-500 mb-1">Budget Used: {percentUsed}%</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className={`h-2.5 rounded-full ${percentUsed > 90 ? 'bg-red-600' : percentUsed > 75 ? 'bg-yellow-400' : 'bg-green-600'}`} 
                style={{ width: `${Math.min(percentUsed, 100)}%` }}
              ></div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default BudgetOverview;
