import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const categories = ["Misc", "Bills", "Food", "Grocery", "Random"];

const EditDialog = ({ open, expense, onSave, onCancel }) => {
  const [form, setForm] = useState({
    description: "",
    category: "Misc",
    amount: "",
    date: new Date(),
  });

  useEffect(() => {
    if (expense) {
      setForm({
        description: expense.description || "",
        category: expense.category || "Misc",
        amount: expense.amount || "",
        date: expense.date ? new Date(expense.date) : new Date(),
      });
    }
  }, [expense]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    setForm((prev) => ({ ...prev, date }));
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-lg font-semibold mb-4">Edit Expense</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave(form);
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-gray-600 mb-1">Description</label>
            <input
              className="w-full p-2 border rounded"
              name="description"
              value={form.description}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-gray-600 mb-1">Category</label>
            <select
              className="w-full p-2 border rounded"
              name="category"
              value={form.category}
              onChange={handleChange}
              required
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-600 mb-1">Amount</label>
            <input
              className="w-full p-2 border rounded"
              name="amount"
              type="number"
              value={form.amount}
              onChange={handleChange}
              required
              min="0"
            />
          </div>
          <div>
            <label className="block text-gray-600 mb-1">Date</label>
            <DatePicker
              className="w-full p-2 border rounded"
              selected={form.date}
              onChange={handleDateChange}
              dateFormat="MM/dd/yyyy"
              required
            />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDialog;
