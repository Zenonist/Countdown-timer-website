import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCategoryDto {
  // NOTE: We don't need color because we use backend to generate a random color
  @IsString()
  @IsNotEmpty()
  name: string;
}
