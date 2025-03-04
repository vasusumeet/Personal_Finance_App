import express from 'express';
import mongoose from 'mongoose';
import { UserData } from './models/UserData'; // Adjust the path as needed

const router = express.Router();

// Create or update user data
router.post('/userdata', async (req, res) => {
    const { userId, salary, recurringSalary } = req.body;

    try {
        let userData = await UserData.findOne({ userId });

        if (userData) {
            userData.salary = salary;
            userData.recurringSalary = recurringSalary;
            await userData.save();
        } else {
            userData = new UserData({ userId, salary, recurringSalary });
            await userData.save();
        }

        res.status(200).json(userData);
    } catch (error) {
        res.status(500).json({ message: 'Error creating or updating user data', error });
    }
});

// Add an expense
router.post('/userdata/:userId/expenses', async (req, res) => {
    const { userId } = req.params;
    const { description, amount, date, category } = req.body;

    try {
        const userData = await UserData.findOne({ userId });

        if (userData) {
            userData.expenses.push({ description, amount, date, category });
            await userData.save();
            res.status(200).json(userData);
        } else {
            res.status(404).json({ message: 'User data not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error adding expense', error });
    }
});

// Add a savings goal
router.post('/userdata/:userId/savings-goals', async (req, res) => {
    const { userId } = req.params;
    const { goalName, targetAmount, currentAmount, deadline } = req.body;

    try {
        const userData = await UserData.findOne({ userId });

        if (userData) {
            userData.savingsGoals.push({ goalName, targetAmount, currentAmount, deadline });
            await userData.save();
            res.status(200).json(userData);
        } else {
            res.status(404).json({ message: 'User data not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error adding savings goal', error });
    }
});

// Get user data
router.get('/userdata/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const userData = await UserData.findOne({ userId });

        if (userData) {
            res.status(200).json(userData);
        } else {
            res.status(404).json({ message: 'User data not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving user data', error });
    }
});

// Update an expense
router.put('/userdata/:userId/expenses/:expenseId', async (req, res) => {
    const { userId, expenseId } = req.params;
    const { description, amount, date, category } = req.body;

    try {
        const userData = await UserData.findOne({ userId });

        if (userData) {
            const expense = userData.expenses.id(expenseId);

            if (expense) {
                expense.description = description;
                expense.amount = amount;
                expense.date = date;
                expense.category = category;
                await userData.save();
                res.status(200).json(userData);
            } else {
                res.status(404).json({ message: 'Expense not found' });
            }
        } else {
            res.status(404).json({ message: 'User data not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating expense', error });
    }
});

// Delete an expense
router.delete('/userdata/:userId/expenses/:expenseId', async (req, res) => {
    const { userId, expenseId } = req.params;

    try {
        const userData = await UserData.findOne({ userId });

        if (userData) {
            const expense = userData.expenses.id(expenseId);

            if (expense) {
                expense.remove();
                await userData.save();
                res.status(200).json(userData);
            } else {
                res.status(404).json({ message: 'Expense not found' });
            }
        } else {
            res.status(404).json({ message: 'User data not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting expense', error });
    }
});

// Update a savings goal
router.put('/userdata/:userId/savings-goals/:goalId', async (req, res) => {
    const { userId, goalId } = req.params;
    const { goalName, targetAmount, currentAmount, deadline } = req.body;

    try {
        const userData = await UserData.findOne({ userId });

        if (userData) {
            const goal = userData.savingsGoals.id(goalId);

            if (goal) {
                goal.goalName = goalName;
                goal.targetAmount = targetAmount;
                goal.currentAmount = currentAmount;
                goal.deadline = deadline;
                await userData.save();
                res.status(200).json(userData);
            } else {
                res.status(404).json({ message: 'Savings goal not found' });
            }
        } else {
            res.status(404).json({ message: 'User data not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating savings goal', error });
    }
});

// Delete a savings goal
router.delete('/userdata/:userId/savings-goals/:goalId', async (req, res) => {
    const { userId, goalId } = req.params;

    try {
        const userData = await UserData.findOne({ userId });

        if (userData) {
            const goal = userData.savingsGoals.id(goalId);

            if (goal) {
                goal.remove();
                await userData.save();
                res.status(200).json(userData);
            } else {
                res.status(404).json({ message: 'Savings goal not found' });
            }
        } else {
            res.status(404).json({ message: 'User data not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting savings goal', error });
    }
});

export default router;
