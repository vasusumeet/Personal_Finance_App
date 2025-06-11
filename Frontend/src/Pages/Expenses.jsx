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

    // Get JWT token from localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Authentication token missing. Please log in again.");
      return;
    }

    try {
      const response = await axios.post(
        `https://personal-finance-app-weld.vercel.app/api/userdata/${user.id}/expenses`, 
        {
          description: formData.description, 
          amount: parseFloat(formData.amount),
          category: formData.category,
          date: formData.date.toISOString().split("T")[0],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );
      
      alert("Expense added successfully!");
      console.log(response.data);
      
      // Reset form after successful submission
      setFormData({
        description: "",
        amount: "",
        category: "Misc",
        date: new Date(),
      });
    } catch (error) {
      console.error("Error posting expense:", error.response?.data || error.message);
      alert("Failed to add expense. Please try again.");
    }
  };

  return (
    <div>
      <Navbar/>
      <div className="max-w-4xl mt-10 p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">Create Expense</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-4 gap-4 items-center">
            <label htmlFor="description" className="text-gray-600 font-medium">
              Description:
            </label>
            <input
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="col-span-3 p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
              required
            />
          </div>
          <div className="grid grid-cols-4 gap-4 items-center">
            <label htmlFor="amount" className="text-gray-600 font-medium">
              Amount:
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="col-span-3 p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
              required
            />
          </div>
          <div className="grid grid-cols-4 gap-4 items-center">
            <label htmlFor="date" className="text-gray-600 font-medium">
              Date:
            </label>
            <DatePicker
              selected={formData.date}
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
              value={formData.category}
              onChange={handleChange}
              className="col-span-3 p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
              required
            >
              <option value="Misc">Misc</option>
              <option value="Bills">Bills</option>
              <option value="Food">Food</option>
              <option value="Grocery">Grocery</option>
              <option value="Random">Random</option>
            </select>
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
          >
            Add Expense
          </button>
        </form>
      </div>
      
      <div className="max-w-5xl mx-auto mt-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <ExpensesByCategory/>
          </div>
          <div className="">
            {user && user.id && <ExpenseHistory userId={user.id} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Expenses;
