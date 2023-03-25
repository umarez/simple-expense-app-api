import { Module } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { ExpensesController } from './expenses.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity, ExpenseEntity } from './expense.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ExpenseEntity, CategoryEntity])],
  providers: [ExpensesService],
  controllers: [ExpensesController],
})
export class ExpensesModule {}
