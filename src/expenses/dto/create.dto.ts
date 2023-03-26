import { Type } from "class-transformer";
import { IsInt, IsString } from "class-validator";

export class CreateExpenseDto {

  @IsInt()
  @Type(() => Number)
  amount: number;

  @IsString()
  description: string;

  @IsString()
  category_id: string;
}
