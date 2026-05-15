import type { Response } from 'express';
import Transaction from '../models/transaction.model.js';
import type { AuthRequest } from '../middleware/authmiddleware.js';
import { transactionSchema } from '../validators/transaction.validator.js';


export const createTransaction = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const parsedData = transactionSchema.parse(req.body);

    const newTransaction = new Transaction({
      ...parsedData,
      userId: req.user?.id
    });

    await newTransaction.save();

    res.status(201).json(newTransaction);
  } catch (error: any) {
    res.status(400).json({ message: 'Validation error or server error', error: error.message });
  }
};

export const getTransactions = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const transactions = await Transaction.find({ userId: req.user?.id }).sort({ date: -1 });
    res.status(200).json(transactions);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getTransactionById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const transaction = await Transaction.findOne({ _id: req.params.id, userId: req.user?.id });
    
    if (!transaction) {
      res.status(404).json({ message: 'Transaction not found' });
      return;
    }

    res.status(200).json(transaction);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateTransaction = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const parsedData = transactionSchema.partial().parse(req.body);

    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, userId: req.user?.id },
      { $set: parsedData },
      { new: true }
    );

    if (!transaction) {
      res.status(404).json({ message: 'Transaction not found' });
      return;
    }

    res.status(200).json(transaction);
  } catch (error: any) {
    res.status(400).json({ message: 'Validation error or server error', error: error.message });
  }
};

export const deleteTransaction = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const transaction = await Transaction.findOneAndDelete({ _id: req.params.id, userId: req.user?.id });

    if (!transaction) {
      res.status(404).json({ message: 'Transaction not found' });
      return;
    }

    res.status(200).json({ message: 'Transaction deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
