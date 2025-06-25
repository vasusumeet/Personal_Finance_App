import React, { useState, useContext } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { UserContext } from "../UserContext";
import Navbar from "../Components/navbar";
import ExpensesByCategory from "../Components/expensesbycat";
import ExpenseHistory from "../Components/expenseHistory";

const Expenses = () => {
  const { user } = useContext(UserContext);
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    category: "Misc",
    date: new Date(),
    paymentMethod: "", // Added default value
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDateChange = (date) => {
    setFormData({ ...formData, date });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !user.id) {
      alert("You must be logged in to add expenses");
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert("Authentication token missing. Please log in again.");
      return;
    }

    try {
      const response = await axios.post(
        `miraculous-beauty-production.up.railway.app/api/userdata/${user.id}/expenses`, 
        {
          description: formData.description, 
          amount: parseFloat(formData.amount),
          category: formData.category,
          date: formData.date.toISOString().split("T")[0],
          paymentMethod: formData.paymentMethod,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );
      
      alert("Expense added successfully!");
      console.log(response.data);
      
      setFormData({
        description: "",
        amount: "",
        category: "Misc",
        date: new Date(),
        paymentMethod: ""
      });
    } catch (error) {
      console.error("Error posting expense:", error.response?.data || error.message);
      alert("Failed to add expense. Please try again.");
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen">
      <Navbar />
      
      {/* Main Container */}
      <div className="container mx-auto px-4 py-6 lg:px-8">
        
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Manage Expenses
          </h1>
          <p className="text-gray-400">Track and categorize your spending</p>
        </div>

        {/* Expense Form */}
        <div className="bg-gray-800 rounded-lg p-4 md:p-6 mb-8 shadow-lg">
          <h2 className="text-xl font-semibold text-white mb-6">Add New Expense</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            {/* Description Field */}
            <div className="flex flex-col md:grid md:grid-cols-4 md:gap-4 md:items-center">
              <label htmlFor="description" className="text-gray-300 font-medium mb-2 md:mb-0">
                Description:
              </label>
              <input
                type="text"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="md:col-span-3 p-3 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none"
                placeholder="Enter expense description"
                required
              />
            </div>

            {/* Amount Field */}
            <div className="flex flex-col md:grid md:grid-cols-4 md:gap-4 md:items-center">
              <label htmlFor="amount" className="text-gray-300 font-medium mb-2 md:mb-0">
                Amount:
              </label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                className="md:col-span-3 p-3 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none"
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
            </div>

            {/* Date Field */}
            <div className="flex flex-col md:grid md:grid-cols-4 md:gap-4 md:items-center">
              <label htmlFor="date" className="text-gray-300 font-medium mb-2 md:mb-0">
                Date:
              </label>
              <div className="md:col-span-3">
                <DatePicker
                  selected={formData.date}
                  onChange={handleDateChange}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none"
                  dateFormat="dd-MM-yyyy"
                  todayButton="Today"
                  required
                />
              </div>
            </div>

            {/* Payment Method Field */}
            <div className="flex flex-col md:grid md:grid-cols-4 md:gap-4 md:items-center">
              <label htmlFor="paymentMethod" className="text-gray-300 font-medium mb-2 md:mb-0">
                Payment Method:
              </label>
              <select
                id="paymentMethod"
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                className="md:col-span-3 p-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none"
                required
              >
                <option value="">Select Payment Method</option>
                <option value="UPI">UPI</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Debit Card">Debit Card</option>
                <option value="Cash">Cash</option>
              </select>
            </div>

            {/* Category Field */}
            <div className="flex flex-col md:grid md:grid-cols-4 md:gap-4 md:items-center">
              <label htmlFor="category" className="text-gray-300 font-medium mb-2 md:mb-0">
                Category:
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="md:col-span-3 p-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none"
                required
              >
                <option value="Misc">Miscellaneous</option>
                <option value="Bills">Bills & Utilities</option>
                <option value="Food">Food & Dining</option>
                <option value="Grocery">Grocery</option>
                <option value="Transportation">Transportation</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Shopping">Shopping</option>
                <option value="Random">Random</option>
              </select>
            </div>
            
            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                Add Expense
              </button>
            </div>
          </form>
        </div>
        
        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Expenses by Category */}
          <div className="bg-gray-800 rounded-lg p-4 md:p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Expenses by Category</h3>
            <ExpensesByCategory />
          </div>
          
          {/* Expense History */}
          <div className="bg-gray-800 rounded-lg p-4 md:p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Recent Expenses</h3>
            {user && user.id && <ExpenseHistory userId={user.id} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Expenses;
