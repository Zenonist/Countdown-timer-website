import { IsString, IsOptional, IsDateString, IsBoolean } from 'class-validator';

export class UpdateTimerDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  dueDate?: string; // Use string for input, will be converted to Date

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsBoolean()
  isArchived?: boolean;
}

