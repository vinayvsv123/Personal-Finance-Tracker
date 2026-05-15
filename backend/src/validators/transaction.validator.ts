import { z } from 'zod';

export const transactionSchema = z.object({
  type: z.enum(['income', 'expense'])
    .refine(val => val === 'income' || val === 'expense', {
      message: "Type must be either 'income' or 'expense'",
    }),

  amount: z.coerce
    .number()
    .positive("Amount must be a positive number"),

  category: z
    .string()
    .min(3, "Category must be at least 3 characters long")
    .trim(),

  note: z.string().trim().optional(),

  date: z.coerce.date()
    .refine(d => !isNaN(d.getTime()), {
      message: "Please provide a valid date",
    }),
});