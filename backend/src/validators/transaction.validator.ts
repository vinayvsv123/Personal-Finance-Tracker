import {z} from 'zod';

export const transactionSchema=z.object({
    type:z.enum(['income','expense'], { required_error: "Type must be either 'income' or 'expense'" }),
    amount:z.number().positive("Amount must be a positive number"),
    category:z.string().min(3,"Category must be at least 3 characters long"),
    note:z.string().optional(),
    date:z.coerce.date({ required_error: "Please provide a valid date" }),
})