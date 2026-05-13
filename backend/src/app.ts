import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app=express();

//middleware
app.use(express.json());
app.use(cors());

app.use('/', (req, res) => {
  res.send('Welcome to the Personal Finance Tracker API');
});

export default app;