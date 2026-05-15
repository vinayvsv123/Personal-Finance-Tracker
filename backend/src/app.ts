import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import userRoutes from './routes/user.route.js';
import transactionRoutes from './routes/transaction.route.js';

const app=express();

//middleware
app.use(express.json());
app.use(cors());

//routes
app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the Personal Finance Tracker API');
});

export default app;