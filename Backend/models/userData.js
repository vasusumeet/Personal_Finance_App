import mongoose from 'mongoose';

const ExpenseSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    category: {
        type: String,
        required: true,
    },
});

const IncomeSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    category: {
        type: String,
        required: true,
    },
});

const SavingsGoalSchema = new mongoose.Schema({
    goalName: {
        type: String,
        required: true,
    },
    targetAmount: {
        type: Number,
        required: true,
    },
    currentAmount: {
        type: Number,
        default: 0,
    },
    deadline: {
        type: Date,
        required: true,
    },
});

// Define the User Data schema
const UserDataSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        username: {
            type: String,
            required: true,
        },
        salary: {
            type: Number,
            required: true,
        },
        recurringSalary: {
            type: Number,
            required: true,
        },
        expenses: [ExpenseSchema],
        income: [IncomeSchema], // New field for one-time income entries
        savingsGoals: [SavingsGoalSchema],
    },
    {
        timestamps: true,
    }
);

export const UserData = mongoose.model('UserData', UserDataSchema);