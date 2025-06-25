import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../UserContext';

const SavingsGoals = () => {
  const { user } = useContext(UserContext);
  const [savingsGoals, setSavingsGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  
  const [editOpen, setEditOpen] = useState(false);
  const [editGoal, setEditGoal] = useState(null);
  const [editFields, setEditFields] = useState({
    goalName: '',
    targetAmount: '',
    currentAmount: '',
    deadline: '',
  });

  // Fetch savings goals
  useEffect(() => {
    const fetchGoals = async () => {
      if (!user || !user.id) return;
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `https://miraculous-beauty-production.up.railway.app/api/userdata/${user.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSavingsGoals(response.data.savingsGoals || []);
      } catch (error) {
        console.error('Error fetching savings goals:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchGoals();
  }, [user]);

  // Open edit dialog
  const handleEditOpen = (goal) => {
    setEditGoal(goal);
    setEditFields({
      goalName: goal.goalName,
      targetAmount: goal.targetAmount,
      currentAmount: goal.currentAmount,
      deadline: goal.deadline ? goal.deadline.split('T')[0] : '',
    });
    setEditOpen(true);
  };

  // Handle edit field changes
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFields((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Save edited goal
  const handleEditSave = async () => {
    if (!editGoal) return;
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `https://miraculous-beauty-production.up.railway.app/api/userdata/${user.id}/savings-goals/${editGoal._id}/update`,
        {
          goalName: editFields.goalName,
          targetAmount: Number(editFields.targetAmount),
          currentAmount: Number(editFields.currentAmount),
          deadline: editFields.deadline,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Refresh goals list with updated goal
      setSavingsGoals((prev) =>
        prev.map((goal) =>
          goal._id === editGoal._id ? response.data.goal : goal
        )
      );
      setEditOpen(false);
      setEditGoal(null);
      alert('Savings goal updated!');
    } catch (error) {
      console.error('Error updating savings goal:', error);
      alert('Failed to update savings goal.');
    }
  };

  // Cancel editing
  const handleEditCancel = () => {
    setEditOpen(false);
    setEditGoal(null);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">My Savings Goals</h3>
      {loading ? (
        <div className="flex justify-center items-center h-32">Loading...</div>
      ) : savingsGoals.length === 0 ? (
        <div className="flex justify-center items-center h-32">No savings goals found.</div>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Goal Name</th>
              <th className="p-2 border">Target Amount</th>
              <th className="p-2 border">Current Amount</th>
              <th className="p-2 border">Deadline</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {savingsGoals.map((goal) => (
              <tr key={goal._id} className="border-b">
                <td className="p-2 border">{goal.goalName}</td>
                <td className="p-2 border">{goal.targetAmount}</td>
                <td className="p-2 border">{goal.currentAmount}</td>
                <td className="p-2 border">
                  {goal.deadline ? new Date(goal.deadline).toLocaleDateString() : '-'}
                </td>
                <td className="p-2 border">
                  <button
                    onClick={() => handleEditOpen(goal)}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:opacity-80"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Edit Dialog */}
      {editOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h4 className="text-lg font-semibold mb-4">Edit Savings Goal</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium">Goal Name</label>
                <input
                  type="text"
                  name="goalName"
                  value={editFields.goalName}
                  onChange={handleEditChange}
                  className="w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Target Amount</label>
                <input
                  type="number"
                  name="targetAmount"
                  value={editFields.targetAmount}
                  onChange={handleEditChange}
                  className="w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Current Amount</label>
                <input
                  type="number"
                  name="currentAmount"
                  value={editFields.currentAmount}
                  onChange={handleEditChange}
                  className="w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Deadline</label>
                <input
                  type="date"
                  name="deadline"
                  value={editFields.deadline}
                  onChange={handleEditChange}
                  className="w-full border rounded p-2"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-5">
              <button
                onClick={handleEditCancel}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSave}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavingsGoals;
