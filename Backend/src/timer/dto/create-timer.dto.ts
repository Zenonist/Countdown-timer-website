import { IsString, IsNotEmpty, IsDateString, IsOptional, IsBoolean } from 'class-validator';

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

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsOptional()
  @IsBoolean()
  isArchived?: boolean;
}
