import {z} from 'zod';

export const transactionSchema=z.object({
    type:z.enum(['income','expense'], " Type must be either 'income' or 'expense'"),
    amoount:z.number().positive(" Amount must be a positive number"),
    category:z.string().min(3," Category must be at least 3 characters long"),
    note:z.string().optional(),
    date:z.date(" Please provide a valid date"),
})