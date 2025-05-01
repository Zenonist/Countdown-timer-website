import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from '../prisma.service';
import { randomColor } from 'randomcolor';
import { Category } from 'generated/prisma';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    try {
      const name: string = createCategoryDto.name;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
      const color: string = randomColor();
      return this.prisma.category.create({
        data: {
          name,
          color,
        },
      });
    } catch (error) {
      console.error('Error creating category:', error);
      throw new InternalServerErrorException('Failed to create category');
    }
  }

  findAll() {
    // TODO: Implement code to return categories from the database
    return `This action returns all category`;
  }

  findOne(id: number) {
    // TODO: Implement code to return category by Id from the database
    return `This action returns a #${id} category`;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    // TODO: Implement code to update category to the database
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    // TODO: Implement code to delete category from the database
    return `This action removes a #${id} category`;
  }
}
