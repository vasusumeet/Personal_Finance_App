import React, { useState, useEffect } from "react";
import axios from "axios";
import ConfirmDialog from "./confirmdialog";
import EditDialog from "./editdialog";
const ExpenseHistory = ({ userId }) => {
  const [expense, setExpense] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 5;

  // Modal state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [pendingEditExp, setPendingEditExp] = useState(null);

  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await axios.get(
          `https://personalfinanceapp-production-3551.up.railway.app/api/userdata/${userId}/expensehis`,
          {
            params: {
              page: currentPage,
              limit: itemsPerPage
            },
            headers: getAuthHeader()
          }
        );
        setExpense(response.data.expenses);
        setTotalPages(response.data.totalPages || 1);
      } catch (error) {
        console.error("Error fetching expenses:", error);
        alert("Failed to load expense history");
      }
    };
    if (userId) fetchExpenses();
  }, [userId, currentPage]);

  const handlePageChange = (newPage) => setCurrentPage(newPage);

  // Show confirm dialog
  const onDeleteClick = (expenseId) => {
    setPendingDeleteId(expenseId);
    setConfirmOpen(true);
  };

  const handleDeleteExp = async () => {
    try {
      await axios.delete(
        `https://personalfinanceapp-production-3551.up.railway.app/api/userdata/${userId}/expenses/${pendingDeleteId}/deleteexp`,
        { headers: getAuthHeader() }
      );
      setExpense((prev) => prev.filter((exp) => exp._id !== pendingDeleteId));
      setConfirmOpen(false);
      setPendingDeleteId(null);
      alert("Expense deleted successfully!");
    } catch (error) {
      console.error("Error deleting expense:", error);
      alert("Failed to delete expense.");
      setConfirmOpen(false);
      setPendingDeleteId(null);
    }
  };

  // Show edit dialog
  const onEditClick = (exp) => {
    setPendingEditExp(exp);
    setEditOpen(true);
  };

  // Save edited expense
  const handleEditExp = async (form) => {
    try {
      await axios.put(
        `https://personalfinanceapp-production-3551.up.railway.app/api/userdata/${userId}/expenses/${pendingEditExp._id}/editexp`,
        {
          ...pendingEditExp,
          ...form,
          amount: parseFloat(form.amount),
          date: form.date.toISOString().split("T")[0],
        },
        { headers: getAuthHeader() }
      );
      setExpense((prev) =>
        prev.map((e) =>
          e._id === pendingEditExp._id
            ? { ...e, ...form, amount: parseFloat(form.amount), date: form.date }
            : e
        )
      );
      setEditOpen(false);
      setPendingEditExp(null);
      alert("Expense updated successfully!");
    } catch (error) {
      console.error("Error editing expense:", error);
      alert("Failed to edit expense.");
      setEditOpen(false);
      setPendingEditExp(null);
    }
  };

  return (
    <div className="mt-8 bg-white shadow-md rounded-lg p-4">
      <h3 className="text-xl font-semibold text-gray-700 mb-4">Expense History</h3>
      <div>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left border">Date</th>
              <th className="p-3 text-left border">Description</th>
              <th className="p-3 text-left border">Category</th>
              <th className="p-3 text-right border">Amount</th>
              <th className="p-3 text-right border">Action</th>
            </tr>
          </thead>
          <tbody>
            {expense && expense.length > 0 ? (
              expense.map((exp) => (
                <tr key={exp._id} className="border-b hover:bg-gray-100">
                  <td className="p-3 border">
                    {new Date(exp.date).toLocaleDateString()}
                  </td>
                  <td className="p-3 border">{exp.description}</td>
                  <td className="p-3 border">{exp.category}</td>
                  <td className="p-3 text-right border">
                    {exp.amount.toFixed(2)}
                  </td>
                  <td className="p-2 border">
                    <button
                      onClick={() => onDeleteClick(exp._id)}
                      className="px-2 py-1.5 bg-red-700 text-white rounded hover:opacity-50"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => onEditClick(exp)}
                      className="px-4 py-1.5 bg-blue-500 text-white rounded hover:opacity-50 ml-2"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-3 text-center">
                  No expenses found
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

      {/* Custom dialogs */}
      <ConfirmDialog
        open={confirmOpen}
        title="Delete Expense"
        message="Are you sure you want to delete this expense?"
        onConfirm={handleDeleteExp}
        onCancel={() => setConfirmOpen(false)}
      />
      <EditDialog
        open={editOpen}
        expense={pendingEditExp}
        onSave={handleEditExp}
        onCancel={() => setEditOpen(false)}
      />
    </div>
  );
};

export default ExpenseHistory;
