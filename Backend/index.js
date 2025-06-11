import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import loginRoute from "./routes/loginRoute.js";
import dataRoute from "./routes/dataRoute.js";
import cors from 'cors';
import {PORT, mongoDBURL} from "./config.js";

const app=express();
app.use(cors());
app.use(express.json());
app.get('/',(request,response)=>{
    console.log('request received on /');
    return response.status(200).send('Personal Finance App')
});
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', 'https://personal-finance-app-front.vercel.app');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.status(200).end();
});

app.use('/api/auth', loginRoute);
app.use('/api', dataRoute);

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
