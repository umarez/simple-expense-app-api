import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { zodError } from 'src/utils';
import { z } from 'zod';
import { CreateExpenseDto } from './dto/create.dto';
import { GetExpenseDto } from './dto/get.dto';
import { ExpensesService } from './expenses.service';
import { ExpenseFilterSchema, ExpenseSchema } from './schema/expense.schema';

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
  getExpense(@Query() data: GetExpenseDto) {
    try {
      ExpenseFilterSchema.parse(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        zodError(error);
      }

      throw new BadRequestException('Internal Error');
    }

    return this.expenseService.getExpense(data, {
      page: data.page,
      limit: data.limit,
      skip: data.skip,
    });
  }

  @Get('total')
  getExpenseAmount() {
    return this.expenseService.getExpenseAmount();
  }

  @Get(':id')
  getExpenseById(@Param('id') id: string) {
    return this.expenseService.getExpenseById(id);
  }

  @Get('category/:id')
  getExpenseByCategory(@Param('id') id: string) {
    return this.expenseService.getExpenseByCategory(id);
  }

  @Post()
  createExpense(@Body() createExpenseDto: CreateExpenseDto) {
    try {
      ExpenseSchema.parse(createExpenseDto);
    } catch (error) {
      if (error instanceof z.ZodError) {
        zodError(error);
      }

      throw new BadRequestException('Internal Error');
    }

    return this.expenseService.createExpense(createExpenseDto);
  }

  // @Delete(':id')
  // deleteExpense(@Body('id') id: string) {
  //   return this.expenseService.deleteExpense(id);
  // }
}
