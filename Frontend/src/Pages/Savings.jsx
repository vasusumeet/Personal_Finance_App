import Navbar from "../Components/navbar";
import React, { useState, useContext } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { UserContext } from "../UserContext";

const Savings = () => {
  const { user } = useContext(UserContext);
  const [formData, setFormData] = useState({
    goalName: "",
    targetAmount: "",
    currentAmount: "0",
    deadline: new Date(),
  });

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
      console.log(response.data);
      
   
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
    </div>
  );
};

export default Savings;