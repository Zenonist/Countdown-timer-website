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
  @IsString()
  categoryName: string;

  @IsOptional()
  @IsBoolean()
  isArchived?: boolean;
}

// Log
// ! Remove categoryId from DTO because the client requires sending API to get categoryId from the server. So Using categoryName instead
