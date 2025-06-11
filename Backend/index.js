import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import loginRoute from "./routes/loginRoute.js";
import dataRoute from "./routes/dataRoute.js";
import cors from 'cors';

dotenv.config();

const app = express();

const allowedOrigins = [
  'https://personal-finance-app-front.vercel.app/login', // Replace with your deployed frontend URL
  'http://localhost:3000'
];
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json());

app.get('/', (req, res) => {
  console.log('request received on /');
  return res.status(200).send('Personal Finance App');
});

app.get('/health', (req, res) => res.status(200).send('OK'));

app.use('/api/auth', loginRoute);
app.use('/api', dataRoute);

const PORT = process.env.PORT || 5000;
const mongoDBURL = process.env.mongoDBURL;

mongoose
  .connect(mongoDBURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('App is connected to Database');
    app.listen(PORT, () => {
      console.log(`App is listening to port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Database connection error:', error);
    process.exit(1);
  });

export default app;
