import { BadRequestException, Catch, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateExpenseDto } from './dto/create-expense';
import { CategoryEntity, ExpenseEntity } from './expense.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectRepository(ExpenseEntity)
    private expenseRepository: Repository<ExpenseEntity>,

    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,
  ) {}

  async createCategoryExpense(name: string) {
    const newCategory = this.categoryRepository.create({
      name,
    });

    return await this.categoryRepository.save(newCategory);
  }
  async getCategoryExpense() {
    return await this.categoryRepository.find();
  }

  async getCategoryExpenseById(id: string) {
    const category = await this.categoryRepository.findOne({
      where: {
        id,
      },
    });
    return category;
  }

  async createExpense(data: CreateExpenseDto) {

    const category = await this.getCategoryExpenseById(data.category_id);

    if(!category) throw new BadRequestException('Category not found');

    const newExpense = this.expenseRepository.create({
        ...data,
        category: category
    })


    return await this.expenseRepository.save(newExpense);
  }

  async deleteExpense(id: string) {
    const expense = await this.expenseRepository.findOne({
      where: {
        id,
      },
    });

    if (!expense) throw new BadRequestException('Expense not found');

    return this.expenseRepository.remove(expense);

  }

  async getAllExpense() {
    return await this.expenseRepository.find();
  }

}
