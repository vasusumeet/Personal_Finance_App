import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import loginRoute from "./routes/loginRoute.js";
import dataRoute from "./routes/dataRoute.js";
import cors from 'cors';
import {PORT} from "./config.js";
import {mongoDBURL} from "./config.js";

const app=express();
app.use(cors());
app.use(express.json());
app.get('/',(request,response)=>{
    console.log('request received on /');
    return response.status(200).send('Personal Finance App')
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
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
