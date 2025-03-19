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
  const [formData, setFormData] = useState({
    goalName: "",
    targetAmount: "",
    currentAmount: "0",
    deadline: new Date(),
  });
  const [savingsGoals, setSavingsGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch existing savings goals
  useEffect(() => {
    const fetchSavingsGoals = async () => {
      if (!user || !user._id) return;
      
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5555/api/userdata/${user._id}`);
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
    
    if (!user || !user._id) {
      alert("You must be logged in to add savings goals");
      return;
    }
    
    try {
      const response = await axios.post(
        `http://localhost:5555/api/userdata/${user._id}/savings-goals`, 
        {
          goalName: formData.goalName,
          targetAmount: parseFloat(formData.targetAmount),
          currentAmount: parseFloat(formData.currentAmount),
          deadline: formData.deadline.toISOString().split("T")[0], 
        }
      );
      
      alert("Savings goal added successfully!");
      
      // Update the savings goals list with the new data
      setSavingsGoals(response.data.savingsGoals);
      
      // Reset form
      setFormData({
        goalName: "",
        targetAmount: "",
        currentAmount: "0",
        deadline: new Date(),
      });
    } catch (error) {
      console.error("Error posting savings goal:", error.response?.data || error.message);
      alert("Failed to add savings goal. Please try again.");
    }
  };

  const handleDelete = async (goalId) => {
    if (!confirm("Are you sure you want to delete this savings goal?")) {
      return;
    }
    
    try {
      const response = await axios.delete(
        `http://localhost:5555/api/userdata/${user._id}/savings-goals/${goalId}`
      );
      
      // Update the savings goals list after deletion
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
      month: '2-digit',
      year: '2-digit'
    });
  };

  // Calculate progress percentage
  const calculateProgress = (current, target) => {
    return Math.min(Math.round((current / target) * 100), 100);
  };

  return (
    <div>
      <Navbar/>
      <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">Create Savings Goal</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-4 gap-4 items-center">
            <label htmlFor="goalName" className="text-gray-600 font-medium">
              Goal Name:
            </label>
            <input
              type="text"
              id="goalName"
              name="goalName"
              value={formData.goalName}
              onChange={handleChange}
              className="col-span-3 p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
              required
            />
          </div>
          <div className="grid grid-cols-4 gap-4 items-center">
            <label htmlFor="targetAmount" className="text-gray-600 font-medium">
              Target Amount:
            </label>
            <input
              type="number"
              id="targetAmount"
              name="targetAmount"
              value={formData.targetAmount}
              onChange={handleChange}
              className="col-span-3 p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
              required
            />
          </div>
          <div className="grid grid-cols-4 gap-4 items-center">
            <label htmlFor="currentAmount" className="text-gray-600 font-medium">
              Current Amount:
            </label>
            <input
              type="number"
              id="currentAmount"
              name="currentAmount"
              value={formData.currentAmount}
              onChange={handleChange}
              className="col-span-3 p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
              required
            />
          </div>
          <div className="grid grid-cols-4 gap-4 items-center">
            <label htmlFor="deadline" className="text-gray-600 font-medium">
              Deadline:
            </label>
            <DatePicker
              selected={formData.deadline}
              onChange={handleDateChange}
              className="col-span-3 p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
              dateFormat="dd-MM-yy"
              todayButton="Today"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition"
          >
            Add Savings Goal
          </button>
        </form>
      </div>

      {/* Savings Goals List with Delete Button */}
      <div className="max-w-4xl mx-auto mt-6 p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Your Savings Goals</h2>
        {loading ? (
          <div className="text-center py-4">Loading savings goals...</div>
        ) : savingsGoals.length === 0 ? (
          <div className="text-center py-4 text-gray-500">No savings goals yet. Add one above!</div>
        ) : (
          <div className="space-y-4">
            {savingsGoals.map((goal) => (
              <div key={goal._id} className="border border-gray-200 rounded-md p-4 flex flex-col">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-lg">{goal.goalName}</h3>
                  <button 
                    onClick={() => handleDelete(goal._id)}
                    className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md transition"
                  >
                    Delete
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm mb-2">
                  <div>
                    <span className="text-gray-500">Target: </span>
                    <span className="font-medium">₹{goal.targetAmount.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Current: </span>
                    <span className="font-medium">₹{goal.currentAmount.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Deadline: </span>
                    <span className="font-medium">{formatDate(goal.deadline)}</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: `${calculateProgress(goal.currentAmount, goal.targetAmount)}%` }}
                  ></div>
                </div>
                <div className="text-right text-xs text-gray-500 mt-1">
                  {calculateProgress(goal.currentAmount, goal.targetAmount)}% complete
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <SavingsProgress/>
      <BudgetOverview/>
    </div>
  );
};

export default Savings;