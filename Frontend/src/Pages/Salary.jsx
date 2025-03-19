import Navbar from "../Components/navbar";
import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { UserContext } from "../UserContext";

const Salary = () => {
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  
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

  // Fetch existing user data on component mount
  useEffect(() => {
    if (user && user._id) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5555/api/userdata/${user._id}`);
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
    
    if (!user || !user._id) {
      alert("You must be logged in to update salary information");
      return;
    }
    
    try {
      const response = await axios.post(
        `http://localhost:5555/api/userdata`,
        {
          userId: user._id,
          username: user.username || userData?.username,
          salary: parseFloat(salaryData.salary),
          recurringSalary: parseFloat(salaryData.recurringSalary)
        }
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
    
    if (!user || !user._id) {
      alert("You must be logged in to add income");
      return;
    }
    
    try {
      const response = await axios.post(
        `http://localhost:5555/api/userdata/${user._id}/income`,
        {
          description: incomeData.description,
          amount: parseFloat(incomeData.amount),
          category: incomeData.category,
          date: incomeData.date
        }
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
      <div>
        <Navbar />
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
          <p className="text-center">Loading salary information...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">Manage Salary & Income</h2>
        
        {/* Tabs for different sections */}
        <div className="mb-8">
          <h3 className="text-xl font-medium text-gray-700 mb-4">Regular Salary Information</h3>
          
          <form onSubmit={handleSalarySubmit} className="space-y-6">
            <div className="grid grid-cols-4 gap-4 items-center">
              <label htmlFor="salary" className="text-gray-600 font-medium">
                Monthly Salary (₹):
              </label>
              <input
                type="number"
                id="salary"
                name="salary"
                value={salaryData.salary}
                onChange={handleSalaryChange}
                className="col-span-3 p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                required
                min="0"
                placeholder="Enter your monthly salary"
              />
            </div>
            
            <div className="grid grid-cols-4 gap-4 items-center">
              <label htmlFor="recurringSalary" className="text-gray-600 font-medium">
                Day of Month (₹):
              </label>
              <input
                type="number"
                id="recurringSalary"
                name="recurringSalary"
                value={salaryData.recurringSalary}
                onChange={handleSalaryChange}
                className="col-span-3 p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                required
                min="1"
                max="31"
                placeholder="Enter day of month when salary is credited (1-31)"
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
            >
              Update Salary Information
            </button>
          </form>
          
          {userData && (
            <div className="mt-4 p-4 bg-gray-50 rounded-md">
              <p className="text-gray-700">
                <span className="font-medium">Current Monthly Salary:</span> ₹{userData.salary ? userData.salary.toFixed(2) : "Not set"}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Salary Credit Date:</span> {userData.recurringSalary ? `${userData.recurringSalary}${getDaySuffix(userData.recurringSalary)} day of each month` : "Not set"}
              </p>
            </div>
          )}
        </div>
        
        <div className="border-t pt-8">
          <h3 className="text-xl font-medium text-gray-700 mb-4">Add One-time Income</h3>
          
          <form onSubmit={handleIncomeSubmit} className="space-y-6">
            <div className="grid grid-cols-4 gap-4 items-center">
              <label htmlFor="description" className="text-gray-600 font-medium">
                Description:
              </label>
              <input
                type="text"
                id="description"
                name="description"
                value={incomeData.description}
                onChange={handleIncomeChange}
                className="col-span-3 p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                required
                placeholder="Bonus, Freelance work, etc."
              />
            </div>
            
            <div className="grid grid-cols-4 gap-4 items-center">
              <label htmlFor="amount" className="text-gray-600 font-medium">
                Amount (₹):
              </label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={incomeData.amount}
                onChange={handleIncomeChange}
                className="col-span-3 p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                required
                min="0"
                placeholder="Enter amount"
              />
            </div>
            
            <div className="grid grid-cols-4 gap-4 items-center">
              <label htmlFor="date" className="text-gray-600 font-medium">
                Date:
              </label>
              <DatePicker
                selected={incomeData.date}
                onChange={handleDateChange}
                className="col-span-3 p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                dateFormat="dd-MM-yy"
                todayButton="Today"
                required
              />
            </div>
            
            <div className="grid grid-cols-4 gap-4 items-center">
              <label htmlFor="category" className="text-gray-600 font-medium">
                Category:
              </label>
              <select
                id="category"
                name="category"
                value={incomeData.category}
                onChange={handleIncomeChange}
                className="col-span-3 p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                required
              >
                <option value="Bonus">Bonus</option>
                <option value="Freelance">Freelance</option>
                <option value="Investment">Investment</option>
                <option value="Gift">Gift</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <button
              type="submit"
              className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition"
            >
              Add One-time Income
            </button>
          </form>
        </div>
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