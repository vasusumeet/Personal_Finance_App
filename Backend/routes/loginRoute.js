import express from 'express';
import { LoginData } from '../models/userLogin.js'; 
import { UserData } from '../models/UserData.js';
import bcrypt from 'bcrypt'; 
import jwt from 'jsonwebtoken';
import { jwtSecret } from '../config.js'; // Assuming you export jwtSecret from config.js

const loginRoute = express.Router();

loginRoute.post('/signup', async (request, response) => {
  try {
    const { username, email, password } = request.body;

    if (!username || !email || !password) {
      return response.status(400).send({ message: 'Enter all fields: Username, Email, and Password' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new LoginData({ username, email, password: hashedPassword });
    await newUser.save();

    const newUserData = new UserData({ userId: newUser._id, username: newUser.username, salary: 0, recurringSalary: 0, expenses: [], savingsGoals: [] });
    await newUserData.save();

    // Prepare user data to send in response (exclude password)
    const userResponse = {
      id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      userData: {
        salary: newUserData.salary,
        recurringSalary: newUserData.recurringSalary,
        expenses: newUserData.expenses,
        savingsGoals: newUserData.savingsGoals
      }
    };

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser._id, username: newUser.username, email: newUser.email },
      jwtSecret,
      { expiresIn: '7d' }
    );

    return response.status(201).send({ message: 'User created successfully', user: userResponse, token });
  } catch (error) {
    console.log(error);
    return response.status(500).send({ message: error.message });
  }
});

loginRoute.post('/login', async (request, response) => {
  try {
    const { identifier, password } = request.body;

    if (!identifier || !password) {
      return response.status(400).send({ message: 'Enter both identifier (username/email) and password' });
    }

    const user = await LoginData.findOne({
      $or: [
        { username: identifier },
        { email: identifier }
      ]
    });

    if (!user) {
      return response.status(404).send({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return response.status(401).send({ message: 'Invalid credentials' });
    }

    // Fetch associated user data
    const userData = await UserData.findOne({ userId: user._id });

    // Prepare user data to send in response (exclude password)
    const userResponse = {
      id: user._id,
      username: user.username,
      email: user.email,
      userData: userData
        ? {
            salary: userData.salary,
            recurringSalary: userData.recurringSalary,
            expenses: userData.expenses,
            savingsGoals: userData.savingsGoals
          }
        : null
    };

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, username: user.username, email: user.email },
      jwtSecret,
      { expiresIn: '7d' }
    );

    return response.status(200).send({ message: 'User authenticated successfully', user: userResponse, token });
  } catch (error) {
    console.log(error);
    return response.status(500).send({ message: error.message });
  }
});

export default loginRoute;
