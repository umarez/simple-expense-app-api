import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Post,
} from '@nestjs/common';
import { z } from 'zod';
import { CreateExpenseDto } from './dto/create-expense';
import { ExpensesService } from './expenses.service';
import { ExpenseSchema } from './schema/expense.schema';

@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expenseService: ExpensesService) {}

  @Post('category')
  createCategory(@Body('name') name: string) {
    return this.expenseService.createCategoryExpense(name);
  }

  @Get('category')
  getCategory() {
    return this.expenseService.getCategoryExpense();
  }

  @Get()
  getAllExpense() {
    return this.expenseService.getAllExpense();
  }

  @Post()
  createExpense(@Body() createExpenseDto: CreateExpenseDto) {
    try {
      ExpenseSchema.parse(createExpenseDto);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.map((err) => {
          return {
            field: err.path[0],
            message: err.message,
          };
        });

        throw new BadRequestException(errors);
      }

      throw new BadRequestException('Internal Error');
    }

    return this.expenseService.createExpense(createExpenseDto);
  }

  @Delete(':id')
  deleteExpense(@Body('id') id: string) {
    return this.expenseService.deleteExpense(id);
  }
}
