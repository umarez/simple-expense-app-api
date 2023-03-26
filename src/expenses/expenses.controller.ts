import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
} from '@nestjs/common';
import { PageOptionsDto } from 'src/dto/page-options.dto';
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
  getExpense(
    @Body() data: GetExpenseDto,
    @Query() pageOptionsDto: PageOptionsDto,
  ) {
    try {
      ExpenseFilterSchema.parse(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        zodError(error);
      }

      throw new BadRequestException('Internal Error');
    }

    return this.expenseService.getExpense(data, pageOptionsDto);
  }

  @Get('total')
  getExpenseAmount() {
    return this.expenseService.getExpenseAmount();
  }

  @Get(':id')
  getExpenseById(@Body('id') id: string) {
    return this.expenseService.getExpenseById(id);
  }

  @Get('category/:id')
  getExpenseByCategory(@Body('id') id: string) {
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
