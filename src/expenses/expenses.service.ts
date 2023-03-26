import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateExpenseDto } from './dto/create.dto';
import { CategoryEntity, ExpenseEntity } from './expense.entity';
import { Between, In, Repository } from 'typeorm';
import { GetExpenseDto } from './dto/get.dto';
import { PageOptionsDto } from 'src/dto/page-options.dto';
import { PageMetaDto } from 'src/dto/page-meta.dto';
import { PageDto } from 'src/dto/page.dto';

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

  // async deleteExpense(id: string) {
  //   const expense = await this.expenseRepository.findOne({
  //     where: {
  //       id,
  //     },
  //   });

  //   if (!expense) throw new BadRequestException('Expense not found');

  //   return this.expenseRepository.remove(expense);
  // }

  async getExpense(data: GetExpenseDto, pageOptionsDto: PageOptionsDto) {
    if (data.category) {
      const category = await this.categoryRepository.find({
        where: {
          id: In(data.category),
        },
      });

      if (!category.length) throw new BadRequestException('Category not found');
    }

    if (data.min_price || data.max_price) {
      if (!data.min_price && data.max_price) data.min_price = 1;
      if (!data.max_price && data.min_price) data.max_price = 2147483647;

      if (data.min_price > data.max_price)
        throw new BadRequestException(
          'Min price cannot be greater than max price',
        );
    }

    const query = this.expenseRepository
      .createQueryBuilder('expense')
      .leftJoinAndSelect('expense.category', 'category')
      .select([
        'expense.id',
        'expense.amount',
        'expense.created_at',
        'category.name',
      ])
      .where({
        ...(data.category && {
          category: {
            id: In(data.category),
          },
        }),
        ...(data.min_price &&
          data.max_price && {
            amount: Between(data.min_price, data.max_price),
          }),
      }).orderBy('expense.created_at', 'DESC').skip(pageOptionsDto.skip);;


    const itemCount = await query.getCount();
    const entities = await query.take(pageOptionsDto.limit).getMany();

    const pagesMetaDto = new PageMetaDto({
      itemCount,
      pageOptionsDto,
    });

    return new PageDto(entities, pagesMetaDto);
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

  async getExpenseById(id: string) {
    const expense = await this.expenseRepository.findOne({
      where: {
        id,
      },
    });

    if (!expense) throw new BadRequestException('Expense not found');

    return expense;
  }

  async getExpenseAmount() {
    const query = this.expenseRepository.createQueryBuilder('expense');

    const total = await query
      .select('SUM(expense.amount)', 'total')
      .getRawOne();

    return total;
  }
}
