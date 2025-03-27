import express from 'express';
import mongoose from 'mongoose';
import { UserData } from '../models/UserData.js';

const dataRoute = express.Router();


dataRoute.post('/userdata', async (req, res) => {
    const { userId, salary, recurringSalary } = req.body;

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
dataRoute.post('/userdata/:userId/income', async (req, res) => {
    const { userId } = req.params;
    const { description, amount, date, category } = req.body;

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


dataRoute.get('/userdata/:userId/income', async (req, res) => {
    const { userId } = req.params;

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


dataRoute.delete('/userdata/:userId/income/:incomeId', async (req, res) => {
    const { userId, incomeId } = req.params;

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

dataRoute.post('/userdata/:userId/expenses', async (req, res) => {
    const { userId } = req.params;
    const { description, amount, date, category } = req.body;

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

dataRoute.post('/userdata/:userId/savings-goals', async (req, res) => {
    const { userId } = req.params;
    const { goalName, targetAmount, currentAmount, deadline } = req.body;

    try {
        const userData = await UserData.findOne({ userId });

        if (!userData) {
            return res.status(404).json({ message: 'User data not found' });
        }

        if (!userData.savingsGoals) userData.savingsGoals = []; // Ensure array exists
        userData.savingsGoals.push({ goalName, targetAmount, currentAmount, deadline });

        await userData.save();
        res.status(200).json(userData);
    } catch (error) {
        console.error('Error adding savings goal:', error);
        res.status(500).json({ message: 'Error adding savings goal', error });
    }
});


dataRoute.get('/userdata/:userId', async (req, res) => {
    const { userId } = req.params;

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


dataRoute.put('/userdata/:userId/expenses/:expenseId', async (req, res) => {
    const { userId, expenseId } = req.params;
    const { description, amount, date, category } = req.body;

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

dataRoute.delete('/userdata/:userId/expenses/:expenseId', async (req, res) => {
    const { userId, expenseId } = req.params;

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


dataRoute.put('/userdata/:userId/savings-goals/:goalId', async (req, res) => {
    const { userId, goalId } = req.params;
    const { goalName, targetAmount, currentAmount, deadline, deductFromSalary } = req.body;
  
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

dataRoute.delete('/userdata/:userId/savings-goals/:goalId', async (req, res) => {
    const { userId, goalId } = req.params;

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

export default dataRoute;
