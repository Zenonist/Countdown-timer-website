import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class CreateTimerDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsDateString()
  @IsNotEmpty()
  dueDate: string; // Use string for input, will be converted to Date

  @IsNotEmpty()
  categoryId: number;

  @IsNotEmpty()
  @IsString()
  categoryName?: string;

  @IsOptional()
  @IsBoolean()
  isArchived?: boolean;
}
