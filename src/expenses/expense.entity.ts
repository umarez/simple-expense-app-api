import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class CategoryEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  name: string;

  @OneToMany((type) => ExpenseEntity, (expense) => expense.category)
  expenses: ExpenseEntity[];
}

@Entity()
export class ExpenseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  name: string;

  @Column('integer')
  amount: number;

  @Column('text')
  description: string;

  @ManyToOne((type) => CategoryEntity, (category) => category.expenses)
  category: CategoryEntity;

  @CreateDateColumn()
  created_at: Date;
}
