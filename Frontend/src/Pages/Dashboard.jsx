import React, { useState, useContext } from 'react';
import { UserContext } from '../UserContext';
import Navbar from '../Components/navbar';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart } from 'recharts';
import spinner from '../Components/spinner';

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useContext(UserContext);
 
  const expensesData = [
    { name: 'Jan', expenses: 400 },
    { name: 'Feb', expenses: 300 },
    { name: 'Mar', expenses: 500 },
    { name: 'Apr', expenses: 200 },
    // Add more data for each month
  ];

  const savingsData = [
    { name: 'Jan', savings: 150 },
    { name: 'Feb', savings: 200 },
    { name: 'Mar', savings: 250 },
    { name: 'Apr', savings: 300 },
    // Add more data for each month
  ];

  const salaryData = [
    { name: 'Jan', salary: 3000 },
    { name: 'Feb', salary: 3200 },
    { name: 'Mar', salary: 3300 },
    { name: 'Apr', salary: 3100 },
    // Add more data for each month
  ];

  return (
    <div className="bg-gray-1 h-full w-full">
      <Navbar />
      
      <div className="h-full w-full bg-gray-700 flex flex-wrap justify-around p-4">
        {/* Expenses Month-wise */}
        <div>
          <p>Welcome, {user.username}!</p>
          <p>Email: {user.email}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 m-4 w-1/3">
          <h2 className="text-lg font-bold mb-4">Month-wise Expenses</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={expensesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="expenses" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Month-wise Savings */}
        <div className="bg-white rounded-lg shadow-md p-4 m-4 w-1/3">
          <h2 className="text-lg font-bold mb-4">Month-wise Savings</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={savingsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="savings" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Salary Data */}
        <div className="bg-white rounded-lg shadow-md p-4 m-4 w-1/3">
          <h2 className="text-lg font-bold mb-4">Salary Data</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salaryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="salary" stroke="#ffc658" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        {/* Salary Data */}
        <div className="bg-white rounded-lg shadow-md p-4 m-4 w-1/3">
          <h2 className="text-lg font-bold mb-4">Salary Data</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salaryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="salary" stroke="#ffc658" />
            </LineChart>
          </ResponsiveContainer>
          
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 m-4 w-1/3">
          <h2 className="text-lg font-bold mb-4">Salary Data</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salaryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="salary" stroke="#ffc658" />
            </LineChart>
          </ResponsiveContainer>
          
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 m-4 w-1/3">
          <h2 className="text-lg font-bold mb-4">Salary Data</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salaryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="salary" stroke="#ffc658" />
            </LineChart>
          </ResponsiveContainer>
          
        </div><div className="bg-white rounded-lg shadow-md p-4 m-4 w-1/3">
          <h2 className="text-lg font-bold mb-4">Salary Data</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salaryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="salary" stroke="#ffc658" />
            </LineChart>
          </ResponsiveContainer>
          
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
