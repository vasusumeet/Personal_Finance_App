import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../UserContext';
import Navbar from '../Components/navbar';
import { useNavigate } from 'react-router-dom';
import Spinner from '../Components/spinner';
import BudgetOverview from '../Components/budgetover';
import ExpensesByCategory from '../Components/expensesbycat';
import MonthlyExpensesTrend from '../Components/monthlyexpenses';
import SavingsProgress from '../Components/savingsprog';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const timer = setTimeout(() => {
      setLoading(false);
    }, 800); 

    return () => clearTimeout(timer);
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen">
      <Navbar />
      
      {}
      <div className="container mx-auto px-4 py-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Welcome back, {user?.name || 'User'}!
          </h1>
          <p className="text-gray-400">Here's your financial overview</p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {/* Budget Overview - Takes full width on mobile, half on tablet, quarter on desktop */}
          <div className="md:col-span-2 lg:col-span-2">
            <BudgetOverview />
          </div>
          
          {/* Expenses by Category */}
          <div className="md:col-span-2 lg:col-span-2">
            <ExpensesByCategory />
          </div>
          
          {/* Savings Progress */}
          <div className="md:col-span-1 lg:col-span-2">
            <SavingsProgress />
          </div>
          
          {/* Monthly Expenses Trend */}
          <div className="md:col-span-1 lg:col-span-2">
            <MonthlyExpensesTrend />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
