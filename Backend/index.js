import express from "express";
import mongoose from "mongoose";
import {PORT, mongoDBURL} from "./config.js";
import loginRoute from "./routes/loginRoute.js";
import dataRoute from "./routes/dataRoute.js";
import cors from 'cors';


const app=express();
app.use(cors());
app.use(express.json());
app.get('/',(request,response)=>{
    console.log('request received on /');
    return response.status(200).send('Personal Finance App')
});

app.use('/api/auth', loginRoute);
app.use('/api', dataRoute);

mongoose
  .connect(mongoDBURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('App is connected to Database');
  })
  .catch((error) => {
    console.error('Database connection error:', error);
process.exit(1);
  });


export default app;


