import * as z from 'zod';

export const ExpenseSchema = z.object({
  amount: z.number(),
  description: z.string(),
  category_id: z.string(),
});
