import { BadRequestException, Catch, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateExpenseDto } from './dto/create';
import { CategoryEntity, ExpenseEntity } from './expense.entity';
import { Between, In, Repository } from 'typeorm';
import { GetExpenseDto } from './dto/get';

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

    if (!category) throw new BadRequestException('Category not found');

    const newExpense = this.expenseRepository.create({
      ...data,
      category: category,
    });

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

  async getExpense(data: GetExpenseDto) {
    if (data.category) {
      const category = await this.categoryRepository.findOne({
        where: {
          id: In(data.category),
        },
      });

      if (!category) throw new BadRequestException('Category not found');
    }

    if (data.min_price || data.max_price) {
      if (!data.min_price) data.min_price = 1;
      if (!data.max_price) data.max_price = Number.MAX_SAFE_INTEGER;

      if (data.min_price > data.max_price)
        throw new BadRequestException(
          'Min price cannot be greater than max price',
        );
    } 


    return await this.expenseRepository.find({
      where: {
        ...(data.category && {
          category: {
            id: In(data.category),
          },
          ...(data.min_price && data.max_price && {
            amount: Between(data.min_price, data.max_price),
          }),
        }),
      },
    });
  }

  async getExpenseByCategory(id: string) {
    const category = await this.categoryRepository.findOne({
      where: {
        id,
      },
    });

    if (!category) throw new BadRequestException('Category not found');

    return await this.expenseRepository.find({
      where: {
        category: category,
      },
    });
  }
}
