import Navbar from "../Components/navbar";
import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { UserContext } from "../UserContext";
import IncomeHistory from "../Components/incomeHistory";

const Salary = () => {
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [activeTab, setActiveTab] = useState('salary');

  // Form state for salary updates
  const [salaryData, setSalaryData] = useState({
    salary: "",
    recurringSalary: ""
  });

  // State for one-time income entry
  const [incomeData, setIncomeData] = useState({
    description: "",
    amount: "",
    category: "Bonus",
    date: new Date(),
  });

  // Helper for JWT header
  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // Fetch existing user data on component mount
  useEffect(() => {
    if (user && user.id) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `miraculous-beauty-production.up.railway.app/api/userdata/${user.id}`,
        { headers: getAuthHeader() }
      );
      setUserData(response.data);

      // Set form data from existing values
      setSalaryData({
        salary: response.data.salary || "",
        recurringSalary: response.data.recurringSalary || ""
      });

      setLoading(false);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setLoading(false);
    }
  };

  // Handle salary form changes
  const handleSalaryChange = (e) => {
    const { name, value } = e.target;
    setSalaryData({ ...salaryData, [name]: value });
  };

  // Handle income form changes
  const handleIncomeChange = (e) => {
    const { name, value } = e.target;
    setIncomeData({ ...incomeData, [name]: value });
  };

  const handleDateChange = (date) => {
    setIncomeData({ ...incomeData, date });
  };

  // Submit handler for salary update
  const handleSalarySubmit = async (e) => {
    e.preventDefault();

    if (!user || !user.id) {
      alert("You must be logged in to update salary information");
      return;
    }

    try {
      const response = await axios.post(
        `miraculous-beauty-production.up.railway.app/api/userdata`,
        {
          userId: user.id,
          username: user.username || userData?.username,
          salary: parseFloat(salaryData.salary),
          recurringSalary: parseFloat(salaryData.recurringSalary)
        },
        { headers: getAuthHeader() }
      );

      alert("Salary information updated successfully!");
      setUserData(response.data);
    } catch (error) {
      console.error("Error updating salary:", error.response?.data || error.message);
      alert("Failed to update salary information. Please try again.");
    }
  };

  // Submit handler for one-time income
  const handleIncomeSubmit = async (e) => {
    e.preventDefault();

    if (!user || !user.id) {
      alert("You must be logged in to add income");
      return;
    }

    try {
      const response = await axios.post(
        `miraculous-beauty-production.up.railway.app/api/userdata/${user.id}/income`,
        {
          description: incomeData.description,
          amount: parseFloat(incomeData.amount),
          category: incomeData.category,
          date: incomeData.date
        },
        { headers: getAuthHeader() }
      );

      alert("Income added successfully!");
      setUserData(response.data);

      // Reset form after successful submission
      setIncomeData({
        description: "",
        amount: "",
        category: "Bonus",
        date: new Date(),
      });
    } catch (error) {
      console.error("Error adding income:", error.response?.data || error.message);
      alert("Failed to add income. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-900 min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-6 lg:px-8">
          <div className="bg-gray-800 rounded-lg p-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-white">Loading salary information...</p>
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
            Income Management
          </h1>
          <p className="text-gray-400">Manage your salary and track additional income sources</p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('salary')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'salary'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              Salary Settings
            </button>
            <button
              onClick={() => setActiveTab('income')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'income'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              Add Income
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'history'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              Income History
            </button>
          </div>
        </div>

        {/* Salary Settings Tab */}
        {activeTab === 'salary' && (
          <div className="bg-gray-800 rounded-lg p-4 md:p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-6">Regular Salary Information</h2>
            
            {/* Current Salary Display */}
            {userData && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="bg-gray-700 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-400 mb-1">Current Monthly Salary</h3>
                  <p className="text-2xl font-bold text-green-400">
                    ₹{userData.salary ? userData.salary.toLocaleString() : "Not set"}
                  </p>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-400 mb-1">Salary Credit Date</h3>
                  <p className="text-2xl font-bold text-blue-400">
                    {userData.recurringSalary ? `${userData.recurringSalary}${getDaySuffix(userData.recurringSalary)}` : "Not set"}
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleSalarySubmit} className="space-y-4 md:space-y-6">
              {/* Monthly Salary */}
              <div className="flex flex-col md:grid md:grid-cols-4 md:gap-4 md:items-center">
                <label htmlFor="salary" className="text-gray-300 font-medium mb-2 md:mb-0">
                  Monthly Salary (₹):
                </label>
                <input
                  type="number"
                  id="salary"
                  name="salary"
                  value={salaryData.salary}
                  onChange={handleSalaryChange}
                  className="md:col-span-3 p-3 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none"
                  required
                  min="0"
                  placeholder="Enter your monthly salary"
                />
              </div>

              {/* Credit Date */}
              <div className="flex flex-col md:grid md:grid-cols-4 md:gap-4 md:items-center">
                <label htmlFor="recurringSalary" className="text-gray-300 font-medium mb-2 md:mb-0">
                  Credit Date (Day of Month):
                </label>
                <input
                  type="number"
                  id="recurringSalary"
                  name="recurringSalary"
                  value={salaryData.recurringSalary}
                  onChange={handleSalaryChange}
                  className="md:col-span-3 p-3 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none"
                  required
                  min="1"
                  max="31"
                  placeholder="Enter day of month (1-31)"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                Update Salary Information
              </button>
            </form>
          </div>
        )}

        {/* Add Income Tab */}
        {activeTab === 'income' && (
          <div className="bg-gray-800 rounded-lg p-4 md:p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-6">Add One-time Income</h2>

            <form onSubmit={handleIncomeSubmit} className="space-y-4 md:space-y-6">
              {/* Description */}
              <div className="flex flex-col md:grid md:grid-cols-4 md:gap-4 md:items-center">
                <label htmlFor="description" className="text-gray-300 font-medium mb-2 md:mb-0">
                  Description:
                </label>
                <input
                  type="text"
                  id="description"
                  name="description"
                  value={incomeData.description}
                  onChange={handleIncomeChange}
                  className="md:col-span-3 p-3 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none"
                  required
                  placeholder="Bonus, Freelance work, etc."
                />
              </div>

              {/* Amount */}
              <div className="flex flex-col md:grid md:grid-cols-4 md:gap-4 md:items-center">
                <label htmlFor="amount" className="text-gray-300 font-medium mb-2 md:mb-0">
                  Amount (₹):
                </label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={incomeData.amount}
                  onChange={handleIncomeChange}
                  className="md:col-span-3 p-3 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none"
                  required
                  min="0"
                  step="0.01"
                  placeholder="Enter amount"
                />
              </div>

              {/* Date */}
              <div className="flex flex-col md:grid md:grid-cols-4 md:gap-4 md:items-center">
                <label htmlFor="date" className="text-gray-300 font-medium mb-2 md:mb-0">
                  Date:
                </label>
                <div className="md:col-span-3">
                  <DatePicker
                    selected={incomeData.date}
                    onChange={handleDateChange}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none"
                    dateFormat="dd-MM-yyyy"
                    todayButton="Today"
                    required
                  />
                </div>
              </div>

              {/* Category */}
              <div className="flex flex-col md:grid md:grid-cols-4 md:gap-4 md:items-center">
                <label htmlFor="category" className="text-gray-300 font-medium mb-2 md:mb-0">
                  Category:
                </label>
                <select
                  id="category"
                  name="category"
                  value={incomeData.category}
                  onChange={handleIncomeChange}
                  className="md:col-span-3 p-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none"
                  required
                >
                  <option value="Bonus">Bonus</option>
                  <option value="Freelance">Freelance Work</option>
                  <option value="Investment">Investment Returns</option>
                  <option value="Gift">Gift Money</option>
                  <option value="Side Hustle">Side Hustle</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-md transition-colors duration-200 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                Add Income
              </button>
            </form>
          </div>
        )}

        {/* Income History Tab */}
        {activeTab === 'history' && (
          <div className="bg-gray-800 rounded-lg p-4 md:p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Income History</h2>
            {user && user.id && <IncomeHistory userId={user.id} />}
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function to get the correct suffix for the day
const getDaySuffix = (day) => {
  if (day >= 11 && day <= 13) return "th";
  switch (day % 10) {
    case 1: return "st";
    case 2: return "nd";
    case 3: return "rd";
    default: return "th";
  }
};

export default Salary;
