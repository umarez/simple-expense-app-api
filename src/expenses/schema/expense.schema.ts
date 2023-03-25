import * as z from 'zod';

export const ExpenseSchema = z.object({
  amount: z.number(),
  description: z.string(),
  category_id: z.string(),
});


export const ExpenseFilterSchema = z.object({
  category: z.array(z.string().uuid()).optional(),
  min_price: z.number().optional(),
  max_price: z.number().optional(),
})
