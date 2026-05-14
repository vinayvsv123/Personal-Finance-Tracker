import mongoose, { Document, Model, Types } from 'mongoose';

export interface ITransaction extends Document {
  userId: Types.ObjectId;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  note?: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

const transactionSchema = new mongoose.Schema<ITransaction>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  note: {
    type: String,
  },
  date: {
    type: Date,
    required: true,
  }
}, {
  timestamps: true,
});

const Transaction: Model<ITransaction> = mongoose.model<ITransaction>('Transaction', transactionSchema);
export default Transaction;