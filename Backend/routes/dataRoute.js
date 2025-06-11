import express from 'express';
import mongoose from 'mongoose';
import { UserData } from '../models/UserData.js';
import authenticate from '../middleware/authMiddleware.js';




const dataRoute = express.Router();

// Apply the JWT middleware to all routes in this router
dataRoute.use(authenticate);

// Helper to check user ownership
function checkOwnership(req, res, userId) {
    if (req.user.id !== userId) {
        return res.status(403).json({ message: 'Forbidden: You do not own this data.' });
    }
    return null;
}

// Fetch or update User Data
dataRoute.post('/userdata', async (req, res) => {
    const { userId, salary, recurringSalary } = req.body;
    const forbidden = checkOwnership(req, res, userId);
    if (forbidden) return;

    try {
        let userData = await UserData.findOne({ userId });

        if (userData) {
            userData.salary = salary;
            userData.recurringSalary = recurringSalary;
        } else {
            userData = new UserData({ userId, salary, recurringSalary });
        }

        await userData.save();
        res.status(200).json(userData);
    } catch (error) {
        console.error('Error saving user data:', error);
        res.status(500).json({ message: 'Error saving user data', error });
    }
});

// Post Income
dataRoute.post('/userdata/:userId/income', async (req, res) => {
    const { userId } = req.params;
    const { description, amount, date, category } = req.body;
    const forbidden = checkOwnership(req, res, userId);
    if (forbidden) return;

    try {
        const userData = await UserData.findOne({ userId });

        if (!userData) {
            return res.status(404).json({ message: 'User data not found' });
        }

        if (!userData.income) userData.income = [];
        userData.income.push({ description, amount, date, category });

        await userData.save();
        res.status(200).json(userData);
    } catch (error) {
        console.error('Error adding income:', error);
        res.status(500).json({ message: 'Error adding income', error });
    }
});

// Get Income Data
dataRoute.get('/userdata/:userId/income', async (req, res) => {
    const { userId } = req.params;
    const forbidden = checkOwnership(req, res, userId);
    if (forbidden) return;

    try {
        const userData = await UserData.findOne({ userId });

        if (!userData) {
            return res.status(404).json({ message: 'User data not found' });
        }

        res.status(200).json(userData.income || []);
    } catch (error) {
        console.error('Error retrieving income:', error);
        res.status(500).json({ message: 'Error retrieving income', error });
    }
});

// Delete Income
dataRoute.delete('/userdata/:userId/income/:incomeId', async (req, res) => {
    const { userId, incomeId } = req.params;
    const forbidden = checkOwnership(req, res, userId);
    if (forbidden) return;

    try {
        const userData = await UserData.findOne({ userId });

        if (!userData) {
            return res.status(404).json({ message: 'User data not found' });
        }

        if (!userData.income) {
            return res.status(404).json({ message: 'No income entries found' });
        }

        userData.income = userData.income.filter(inc => inc._id.toString() !== incomeId);
        await userData.save();

        res.status(200).json(userData);
    } catch (error) {
        console.error('Error deleting income:', error);
        res.status(500).json({ message: 'Error deleting income', error });
    }
});

// Post Expense
dataRoute.post('/userdata/:userId/expenses', async (req, res) => {
    const { userId } = req.params;
    const { description, amount, date, category } = req.body;
    const forbidden = checkOwnership(req, res, userId);
    if (forbidden) return;

    try {
        const userData = await UserData.findOne({ userId });

        if (!userData) {
            return res.status(404).json({ message: 'User data not found' });
        }

        if (!userData.expenses) userData.expenses = [];
        userData.expenses.push({ description, amount, date, category });

        await userData.save();
        res.status(200).json(userData);
    } catch (error) {
        console.error('Error adding expense:', error);
        res.status(500).json({ message: 'Error adding expense', error });
    }
});
// Edit an expense
dataRoute.put('/userdata/:userId/expenses/:expenseId/editexp', async (req, res) => {
    const { userId, expenseId } = req.params;
    const { description, amount, date, category } = req.body;
    const forbidden = checkOwnership(req, res, userId);
    if (forbidden) return;

    try {
        const userData = await UserData.findOne({ userId });
        if (!userData) {
            return res.status(404).json({ message: 'User data not found' });
        }

        const expense = userData.expenses.id(expenseId);
        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }

        // Update the fields
        if (description !== undefined) expense.description = description;
        if (amount !== undefined) expense.amount = amount;
        if (date !== undefined) expense.date = date;
        if (category !== undefined) expense.category = category;

        await userData.save();
        res.status(200).json({ message: 'Expense updated successfully', expense });
    } catch (error) {
        console.error('Error editing expense:', error);
        res.status(500).json({ message: 'Error editing expense', error });
    }
});

// Delete an expense
dataRoute.delete('/userdata/:userId/expenses/:expenseId/deleteexp', async (req, res) => {
    const { userId, expenseId } = req.params;
    const forbidden = checkOwnership(req, res, userId);
    if (forbidden) return;

    try {
        const userData = await UserData.findOne({ userId });
        if (!userData) {
            return res.status(404).json({ message: 'User data not found' });
        }

        const originalLength = userData.expenses.length;
        userData.expenses = userData.expenses.filter(exp => exp._id.toString() !== expenseId);
        if (userData.expenses.length === originalLength) {
            return res.status(404).json({ message: 'Expense not found' });
        }

        await userData.save();
        res.status(200).json({ message: 'Expense deleted successfully' });
    } catch (error) {
        console.error('Error deleting expense:', error);
        res.status(500).json({ message: 'Error deleting expense', error });
    }
});


// Add Savings Goal
dataRoute.post('/userdata/:userId/savings-goals', async (req, res) => {
    const { userId } = req.params;
    const { goalName, targetAmount, currentAmount, deadline } = req.body;
    const forbidden = checkOwnership(req, res, userId);
    if (forbidden) return;

    try {
        const userData = await UserData.findOne({ userId });

        if (!userData) {
            return res.status(404).json({ message: 'User data not found' });
        }

        if (!userData.savingsGoals) userData.savingsGoals = [];
        userData.savingsGoals.push({ goalName, targetAmount, currentAmount, deadline });

        await userData.save();
        res.status(200).json(userData);
    } catch (error) {
        console.error('Error adding savings goal:', error);
        res.status(500).json({ message: 'Error adding savings goal', error });
    }
});

// Fetch User Data
dataRoute.get('/userdata/:userId', async (req, res) => {
    const { userId } = req.params;
    const forbidden = checkOwnership(req, res, userId);
    if (forbidden) return;

    try {
        const userData = await UserData.findOne({ userId });

        if (!userData) {
            return res.status(404).json({ message: 'User data not found' });
        }

        res.status(200).json(userData);
    } catch (error) {
        console.error('Error retrieving user data:', error);
        res.status(500).json({ message: 'Error retrieving user data', error });
    }
});

// Update Expense
dataRoute.put('/userdata/:userId/expenses/:expenseId', async (req, res) => {
    const { userId, expenseId } = req.params;
    const { description, amount, date, category } = req.body;
    const forbidden = checkOwnership(req, res, userId);
    if (forbidden) return;

    try {
        const userData = await UserData.findOne({ userId });

        if (!userData) {
            return res.status(404).json({ message: 'User data not found' });
        }

        const expense = userData.expenses.id(expenseId);
        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }

        expense.description = description;
        expense.amount = amount;
        expense.date = date;
        expense.category = category;

        await userData.save();
        res.status(200).json(userData);
    } catch (error) {
        console.error('Error updating expense:', error);
        res.status(500).json({ message: 'Error updating expense', error });
    }
});

// Delete Expense
dataRoute.delete('/userdata/:userId/expenses/:expenseId', async (req, res) => {
    const { userId, expenseId } = req.params;
    const forbidden = checkOwnership(req, res, userId);
    if (forbidden) return;

    try {
        const userData = await UserData.findOne({ userId });

        if (!userData) {
            return res.status(404).json({ message: 'User data not found' });
        }

        userData.expenses = userData.expenses.filter(exp => exp._id.toString() !== expenseId);
        await userData.save();

        res.status(200).json(userData);
    } catch (error) {
        console.error('Error deleting expense:', error);
        res.status(500).json({ message: 'Error deleting expense', error });
    }
});

// Update Savings Goal
dataRoute.put('/userdata/:userId/savings-goals/:goalId', async (req, res) => {
    const { userId, goalId } = req.params;
    const { goalName, targetAmount, currentAmount, deadline, deductFromSalary } = req.body;
    const forbidden = checkOwnership(req, res, userId);
    if (forbidden) return;

    try {
        const userData = await UserData.findOne({ userId });

        if (!userData) {
            return res.status(404).json({ message: 'User data not found' });
        }

        const goal = userData.savingsGoals.id(goalId);
        if (!goal) {
            return res.status(404).json({ message: 'Savings goal not found' });
        }

        if (goalName) goal.goalName = goalName;
        if (targetAmount) goal.targetAmount = targetAmount;
        if (deadline) goal.deadline = deadline;

        if (currentAmount) {
            goal.currentAmount += currentAmount;
        }

        if (deductFromSalary) {
            if (userData.recurringSalary >= currentAmount) {
                userData.recurringSalary -= currentAmount;
            } else {
                userData.salary -= currentAmount;
            }
        }

        await userData.save();
        res.status(200).json(userData);
    } catch (error) {
        console.error('Error updating savings goal:', error);
        res.status(500).json({ message: 'Error updating savings goal', error });
    }
});

// Delete Savings Goal
dataRoute.delete('/userdata/:userId/savings-goals/:goalId', async (req, res) => {
    const { userId, goalId } = req.params;
    const forbidden = checkOwnership(req, res, userId);
    if (forbidden) return;

    try {
        const userData = await UserData.findOne({ userId });

        if (!userData) {
            return res.status(404).json({ message: 'User data not found' });
        }

        userData.savingsGoals = userData.savingsGoals.filter(goal => goal._id.toString() !== goalId);
        await userData.save();

        res.status(200).json(userData);
    } catch (error) {
        console.error('Error deleting savings goal:', error);
        res.status(500).json({ message: 'Error deleting savings goal', error });
    }
});

// Contribute to Savings Goal
dataRoute.post('/userdata/:userId/savings-goals/:goalId/contribute', async (req, res) => {
    const { userId, goalId } = req.params;
    const { amount } = req.body;
    const forbidden = checkOwnership(req, res, userId);
    if (forbidden) return;

    try {
        const userData = await UserData.findOne({ userId });

        if (!userData) {
            return res.status(404).json({ message: 'User data not found' });
        }

        const goal = userData.savingsGoals.id(goalId);
        if (!goal) {
            return res.status(404).json({ message: 'Savings goal not found' });
        }

        // Check if user has enough salary to contribute
        if (userData.recurringSalary >= amount) {
            userData.recurringSalary -= amount;
            goal.currentAmount += amount;
        } else if (userData.salary >= amount) {
            userData.salary -= amount;
            goal.currentAmount += amount;
        } else {
            return res.status(400).json({ message: 'Insufficient funds' });
        }

        await userData.save();
        res.status(200).json(userData);
    } catch (error) {
        console.error('Error contributing to savings goal:', error);
        res.status(500).json({ message: 'Error contributing to savings goal', error });
    }
});

// End-of-Month Savings
dataRoute.post('/userdata/:userId/end-of-month-savings', async (req, res) => {
    const { userId } = req.params;
    const forbidden = checkOwnership(req, res, userId);
    if (forbidden) return;

    try {
        const userData = await UserData.findOne({ userId });

        if (!userData) {
            return res.status(404).json({ message: 'User data not found' });
        }

        // Calculate total expenses for the month
        const totalExpenses = userData.expenses ?
            userData.expenses.reduce((sum, expense) => sum + expense.amount, 0) : 0;

        // Calculate remaining salary after expenses
        let remainingSalary = userData.salary - totalExpenses;

        // If recurring salary exists, add it
        if (userData.recurringSalary) {
            remainingSalary += userData.recurringSalary;
        }

        // Transfer remaining salary to a general savings category
        if (!userData.savings) {
            userData.savings = [];
        }

        userData.savings.push({
            amount: remainingSalary,
            date: new Date(),
            description: 'End of month savings transfer'
        });

        // Reset salary and recurring salary
        userData.salary = 0;
        userData.recurringSalary = 0;

        // Clear monthly expenses
        userData.expenses = [];

        await userData.save();
        res.status(200).json(userData);
    } catch (error) {
        console.error('Error processing end-of-month savings:', error);
        res.status(500).json({ message: 'Error processing end-of-month savings', error });
    }
});

// Fetch Expenses (paginated)
dataRoute.get('/userdata/:userId/expensehis', async (req, res) => {
    const userId = req.params.userId;
    const forbidden = checkOwnership(req, res, userId);
    if (forbidden) return;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    try {
        const userData = await UserData.findOne({ userId });

        if (!userData) {
            return res.status(404).json({ message: 'User data not found' });
        }

        const expenses = userData.expenses || [];
        const total = expenses.length;

        const paginatedExpenses = expenses
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(skip, skip + limit);

        res.json({
            expenses: paginatedExpenses,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        });
    } catch (error) {
        console.error('Error fetching expenses:', error);
        res.status(500).json({ message: 'Error fetching expenses' });
    }
});

// Fetch Income (paginated)
dataRoute.get('/userdata/:userId/incomehis', async (req, res) => {
    const userId = req.params.userId;
    const forbidden = checkOwnership(req, res, userId);
    if (forbidden) return;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    try {
        const userData = await UserData.findOne({ userId });

        if (!userData) {
            return res.status(404).json({ message: 'User data not found' });
        }

        const income = userData.income || [];
        const total = income.length;

        const paginatedIncome = income
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(skip, skip + limit);

        res.json({
            income: paginatedIncome,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        });
    } catch (error) {
        console.error('Error fetching Income:', error);
        res.status(500).json({ message: 'Error fetching Income' });
    }
});

export default dataRoute;
