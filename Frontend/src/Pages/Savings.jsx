import Navbar from "../Components/navbar";
import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { UserContext } from "../UserContext";
import SavingsProgress from "../Components/savingsprog";
import BudgetOverview from "../Components/budgetover";

const Savings = () => {
  const { user } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState('create');
  const [formData, setFormData] = useState({
    goalName: "",
    targetAmount: "",
    currentAmount: "0",
    deadline: new Date(),
  });
  const [savingsGoals, setSavingsGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper for JWT header
  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // Fetch existing savings goals
  useEffect(() => {
    const fetchSavingsGoals = async () => {
      if (!user || !user.id) return;
      
      try {
        setLoading(true);
        const response = await axios.get(
          `https://personalfinanceapp-production-3551.up.railway.app/api/userdata/${user.id}`,
          { headers: getAuthHeader() }
        );
        const userData = response.data;
        setSavingsGoals(userData.savingsGoals || []);
      } catch (error) {
        console.error('Error fetching savings goals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSavingsGoals();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDateChange = (date) => {
    setFormData({ ...formData, deadline: date });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user || !user.id) {
      alert("You must be logged in to add savings goals");
      return;
    }
    
    try {
      const response = await axios.post(
        `https://personalfinanceapp-production-3551.up.railway.app/api/userdata/${user.id}/savings-goals`, 
        {
          goalName: formData.goalName,
          targetAmount: parseFloat(formData.targetAmount),
          currentAmount: parseFloat(formData.currentAmount),
          deadline: formData.deadline.toISOString().split("T")[0], 
        },
        { headers: getAuthHeader() }
      );
      
      alert("Savings goal added successfully!");
      setSavingsGoals(response.data.savingsGoals);
      setFormData({
        goalName: "",
        targetAmount: "",
        currentAmount: "0",
        deadline: new Date(),
      });
      setActiveTab('goals'); // Switch to goals tab after creation
    } catch (error) {
      console.error("Error posting savings goal:", error.response?.data || error.message);
      alert("Failed to add savings goal. Please try again.");
    }
  };

  const handleDelete = async (goalId) => {
    if (!window.confirm("Are you sure you want to delete this savings goal?")) {
      return;
    }
    
    try {
      const response = await axios.delete(
        `https://personalfinanceapp-production-3551.up.railway.app/api/userdata/${user.id}/savings-goals/${goalId}`,
        { headers: getAuthHeader() }
      );
      setSavingsGoals(response.data.savingsGoals);
      alert("Savings goal deleted successfully!");
    } catch (error) {
      console.error("Error deleting savings goal:", error);
      alert("Failed to delete savings goal. Please try again.");
    }
  };

  // Function to format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Calculate progress percentage
  const calculateProgress = (current, target) => {
    return Math.min(Math.round((current / target) * 100), 100);
  };

  // Calculate days remaining
  const getDaysRemaining = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Get status color based on progress and deadline
  const getStatusColor = (current, target, deadline) => {
    const progress = calculateProgress(current, target);
    const daysRemaining = getDaysRemaining(deadline);
    
    if (progress >= 100) return 'text-green-400';
    if (daysRemaining < 30 && progress < 50) return 'text-red-400';
    if (progress >= 75) return 'text-blue-400';
    return 'text-yellow-400';
  };

  if (loading) {
    return (
      <div className="bg-gray-900 min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-6 lg:px-8">
          <div className="bg-gray-800 rounded-lg p-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-white">Loading savings goals...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen">
      <Navbar />
      
      {/* Main Container */}
      <div className="container mx-auto px-4 py-6 lg:px-8">
        
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Savings Goals
          </h1>
          <p className="text-gray-400">Set financial targets and track your progress towards achieving them</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-400 mb-1">Total Goals</h3>
            <p className="text-2xl font-bold text-white">{savingsGoals.length}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-400 mb-1">Total Target</h3>
            <p className="text-2xl font-bold text-green-400">
              ₹{savingsGoals.reduce((sum, goal) => sum + goal.targetAmount, 0).toLocaleString()}
            </p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-400 mb-1">Total Saved</h3>
            <p className="text-2xl font-bold text-blue-400">
              ₹{savingsGoals.reduce((sum, goal) => sum + goal.currentAmount, 0).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('create')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'create'
                  ? 'bg-green-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              Create Goal
            </button>
            <button
              onClick={() => setActiveTab('goals')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'goals'
                  ? 'bg-green-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              My Goals ({savingsGoals.length})
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'analytics'
                  ? 'bg-green-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              Analytics
            </button>
          </div>
        </div>

        {/* Create Goal Tab */}
        {activeTab === 'create' && (
          <div className="bg-gray-800 rounded-lg p-4 md:p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-6">Create New Savings Goal</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
              {/* Goal Name */}
              <div className="flex flex-col md:grid md:grid-cols-4 md:gap-4 md:items-center">
                <label htmlFor="goalName" className="text-gray-300 font-medium mb-2 md:mb-0">
                  Goal Name:
                </label>
                <input
                  type="text"
                  id="goalName"
                  name="goalName"
                  value={formData.goalName}
                  onChange={handleChange}
                  className="md:col-span-3 p-3 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent focus:outline-none"
                  placeholder="e.g., Emergency Fund, Vacation, New Car"
                  required
                />
              </div>

              {/* Target Amount */}
              <div className="flex flex-col md:grid md:grid-cols-4 md:gap-4 md:items-center">
                <label htmlFor="targetAmount" className="text-gray-300 font-medium mb-2 md:mb-0">
                  Target Amount (₹):
                </label>
                <input
                  type="number"
                  id="targetAmount"
                  name="targetAmount"
                  value={formData.targetAmount}
                  onChange={handleChange}
                  className="md:col-span-3 p-3 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent focus:outline-none"
                  placeholder="Enter your target amount"
                  min="1"
                  step="0.01"
                  required
                />
              </div>

              {/* Current Amount */}
              <div className="flex flex-col md:grid md:grid-cols-4 md:gap-4 md:items-center">
                <label htmlFor="currentAmount" className="text-gray-300 font-medium mb-2 md:mb-0">
                  Current Amount (₹):
                </label>
                <input
                  type="number"
                  id="currentAmount"
                  name="currentAmount"
                  value={formData.currentAmount}
                  onChange={handleChange}
                  className="md:col-span-3 p-3 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent focus:outline-none"
                  placeholder="Amount already saved"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              {/* Deadline */}
              <div className="flex flex-col md:grid md:grid-cols-4 md:gap-4 md:items-center">
                <label htmlFor="deadline" className="text-gray-300 font-medium mb-2 md:mb-0">
                  Target Date:
                </label>
                <div className="md:col-span-3">
                  <DatePicker
                    selected={formData.deadline}
                    onChange={handleDateChange}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent focus:outline-none"
                    dateFormat="dd-MM-yyyy"
                    minDate={new Date()}
                    todayButton="Today"
                    required
                  />
                </div>
              </div>
              
              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-md transition-colors duration-200 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                Create Savings Goal
              </button>
            </form>
          </div>
        )}

        {/* My Goals Tab */}
        {activeTab === 'goals' && (
          <div className="space-y-6">
            {savingsGoals.length === 0 ? (
              <div className="bg-gray-800 rounded-lg p-8 text-center">
                <div className="text-6xl mb-4">🎯</div>
                <h3 className="text-xl font-semibold text-white mb-2">No Savings Goals Yet</h3>
                <p className="text-gray-400 mb-6">Start your financial journey by creating your first savings goal</p>
                <button
                  onClick={() => setActiveTab('create')}
                  className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-md transition-colors"
                >
                  Create Your First Goal
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {savingsGoals.map((goal) => {
                  const progress = calculateProgress(goal.currentAmount, goal.targetAmount);
                  const daysRemaining = getDaysRemaining(goal.deadline);
                  const statusColor = getStatusColor(goal.currentAmount, goal.targetAmount, goal.deadline);
                  
                  return (
                    <div key={goal._id} className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-1">{goal.goalName}</h3>
                          <p className={`text-sm font-medium ${statusColor}`}>
                            {progress >= 100 ? '🎉 Goal Achieved!' : 
                             daysRemaining < 0 ? '⏰ Overdue' :
                             daysRemaining === 0 ? '📅 Due Today' :
                             `📅 ${daysRemaining} days remaining`}
                          </p>
                        </div>
                        <button 
                          onClick={() => handleDelete(goal._id)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-900/20 p-2 rounded-md transition-colors"
                          title="Delete Goal"
                        >
                          🗑️
                        </button>
                      </div>

                      <div className="space-y-3 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Progress</span>
                          <span className="text-white font-medium">{progress}%</span>
                        </div>
                        
                        <div className="w-full bg-gray-700 rounded-full h-3">
                          <div 
                            className={`h-3 rounded-full transition-all duration-500 ${
                              progress >= 100 ? 'bg-green-500' :
                              progress >= 75 ? 'bg-blue-500' :
                              progress >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${Math.min(progress, 100)}%` }}
                          ></div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-400 block">Current</span>
                            <span className="text-white font-semibold">₹{goal.currentAmount.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-gray-400 block">Target</span>
                            <span className="text-white font-semibold">₹{goal.targetAmount.toLocaleString()}</span>
                          </div>
                        </div>

                        <div className="text-sm">
                          <span className="text-gray-400">Deadline: </span>
                          <span className="text-white">{formatDate(goal.deadline)}</span>
                        </div>

                        <div className="text-sm">
                          <span className="text-gray-400">Remaining: </span>
                          <span className="text-white font-semibold">
                            ₹{(goal.targetAmount - goal.currentAmount).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-800 rounded-lg p-4 md:p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Savings Progress</h3>
              <SavingsProgress />
            </div>
            
            <div className="bg-gray-800 rounded-lg p-4 md:p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Budget Overview</h3>
              <BudgetOverview />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Savings;
