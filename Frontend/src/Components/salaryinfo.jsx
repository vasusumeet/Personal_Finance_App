import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { UserContext } from "../UserContext";

const SalaryInfo = () => {
  const { user } = useContext(UserContext);
  const [salaryData, setSalaryData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.id) {
      fetchSalaryData();
    }
    // eslint-disable-next-line
  }, [user]);

  const fetchSalaryData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No auth token found. Please login again.');
        setLoading(false);
        return;
      }
      const response = await axios.get(
        `https://personal-finance-app-weld.vercel.app/api/userdata/${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setSalaryData({
        salary: response.data.salary,
        recurringSalary: response.data.recurringSalary
      });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching salary data:", error);
      setLoading(false);
    }
  };

  const calculateDaysUntilSalary = () => {
    if (!salaryData || !salaryData.recurringSalary) return null;
    
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    let nextSalaryDate = new Date(currentYear, currentMonth, salaryData.recurringSalary);

    if (now > nextSalaryDate) {
      if (currentMonth === 11) {
        nextSalaryDate = new Date(currentYear + 1, 0, salaryData.recurringSalary);
      } else {
        nextSalaryDate = new Date(currentYear, currentMonth + 1, salaryData.recurringSalary);
      }
    }

    const differenceInTime = nextSalaryDate.getTime() - now.getTime();
    return Math.ceil(differenceInTime / (1000 * 3600 * 24));
  };

  if (loading) {
    return <div className="text-center py-4">Loading salary information...</div>;
  }

  if (!salaryData || !salaryData.salary) {
    return (
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-700 mb-2">Salary Information</h3>
        <p className="text-gray-500 italic">No salary information available. Please set up your salary details.</p>
      </div>
    );
  }

  const daysUntilSalary = calculateDaysUntilSalary();

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-700 mb-3">Salary Information</h3>
      <div className="space-y-2">
        <p className="text-gray-600">
          <span className="font-medium">Monthly Salary:</span> ₹{salaryData.salary.toFixed(2)}
        </p>
        <p className="text-gray-600">
          <span className="font-medium">Salary Credit Date:</span> {salaryData.recurringSalary}{getDaySuffix(salaryData.recurringSalary)} of each month
        </p>
        {daysUntilSalary !== null && (
          <div className={`mt-3 p-2 rounded ${daysUntilSalary <= 3 ? 'bg-green-100' : 'bg-blue-50'}`}>
            <p className={`font-medium ${daysUntilSalary <= 3 ? 'text-green-700' : 'text-blue-700'}`}>
              {daysUntilSalary === 0 ? "Your salary is due today!" : 
               daysUntilSalary === 1 ? "Your salary is due tomorrow!" :
               `${daysUntilSalary} days until your next salary`}
            </p>
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

export default SalaryInfo;
