import { Transform, Type } from "class-transformer"
import { IsArray, IsInt, IsNumber, IsOptional } from "class-validator"
import { PageOptionsDto } from "src/dto/page-options.dto"

export class GetExpenseDto extends PageOptionsDto {
    @IsOptional()
    @IsArray()
    category_id?: string[]

    @IsOptional()
    @IsInt()
    @Type(() => Number)
    min_price?: number

    @IsOptional()
    @IsInt()
    @Type(() => Number)
    max_price?: number
}