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
    <div className="bg-gray-900 h-full w-full">
      <Navbar/>
      <div className="h-full w-full bg-gray-700 flex flex-wrap justify-around p-12">
        <div className='w-1/4 h-1/4 p-4'>
          <BudgetOverview/>
        </div>
        <div className='w-1/4 h-1/4 p-4'>
          <ExpensesByCategory/>
        </div>
        <div className='w-1/4 h-1/4 p-4'>
          <SavingsProgress/>
        </div>
        <div className='w-1/4 h-1/4 p-4'>
          <MonthlyExpensesTrend/>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
