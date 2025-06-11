import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { UserContext } from "../UserContext";

const IncomeList = () => {
  const { user } = useContext(UserContext);
  const [incomeEntries, setIncomeEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user._id) {
      fetchIncomeData();
    }
  }, [user]);

  
  const fetchIncomeData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`https://personal-finance-app-weld.vercel.app/api/userdata/${user._id}/income`);
      setIncomeEntries(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching income data:", error);
      setLoading(false);
    }
  };

  const handleDelete = async (incomeId) => {
    if (window.confirm("Are you sure you want to delete this income entry?")) {
      try {
        await axios.delete(`https://personal-finance-app-weld.vercel.app/api/userdata/${user._id}/income/${incomeId}`);
        fetchIncomeData(); // Refresh list after deletion
      } catch (error) {
        console.error("Error deleting income entry:", error);
        alert("Failed to delete income entry. Please try again.");
      }
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return <div className="text-center py-4">Loading income data...</div>;
  }

  if (incomeEntries.length === 0) {
    return <div className="text-center py-4 text-gray-500 italic">No income entries found.</div>;
  }

  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium text-gray-700 mb-3">Income History</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 text-left">Description</th>
              <th className="py-2 px-4 text-left">Amount</th>
              <th className="py-2 px-4 text-left">Category</th>
              <th className="py-2 px-4 text-left">Date</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {incomeEntries.map((income) => (
              <tr key={income._id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4">{income.description}</td>
                <td className="py-2 px-4 font-medium text-green-600">₹{income.amount.toFixed(2)}</td>
                <td className="py-2 px-4">
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                    {income.category}
                  </span>
                </td>
                <td className="py-2 px-4">{formatDate(income.date)}</td>
                <td className="py-2 px-4">
                  <button
                    onClick={() => handleDelete(income._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IncomeList;
