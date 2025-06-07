import React, { useState, useEffect } from "react";
import axios from "axios";

const IncomeHistory = ({ userId }) => {
  const [income, setIncome] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchIncome = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5555/api/userdata/${userId}/incomehis`,
          {
            params: {
              page: currentPage,
              limit: itemsPerPage
            }
          }
        );

        setIncome(response.data.income);
        setTotalPages(response.data.totalPages || 1);
      } catch (error) {
        console.error("Error fetching Income:", error);
        alert("Failed to load Income History");
      }
    };

    if (userId) {
      fetchIncome();
    }
  }, [userId, currentPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="mt-8 bg-white shadow-md rounded-lg p-6">
      <h3 className="text-xl font-semibold text-gray-700 mb-4">Income History</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left border">Date</th>
              <th className="p-3 text-left border">Description</th>
              <th className="p-3 text-left border">Category</th>
              <th className="p-3 text-right border">Amount</th>
            </tr>
          </thead>
          <tbody>
            {income && income.length > 0 ? (
              income.map((inc) => (
                <tr key={inc._id} className="border-b hover:bg-gray-50">
                  <td className="p-3 border">
                    {new Date(inc.date).toLocaleDateString()}
                  </td>
                  <td className="p-3 border">{inc.description}</td>
                  <td className="p-3 border">{inc.category}</td>
                  <td className="p-3 text-right border">
                    {inc.amount.toFixed(2)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-3 text-center">
                  No Income found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination Controls */}
      <div className="flex justify-center items-center mt-4 space-x-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default IncomeHistory;