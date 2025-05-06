import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from '../prisma.service';
import { randomColor } from 'randomcolor';
import { Category } from 'generated/prisma';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    try {
      const name: string = createCategoryDto.name;
      return await this.prisma.category.create({
        data: this.createCategoryData(name),
      });
    } catch (error) {
      console.error('Error creating category:', error);
      throw new InternalServerErrorException('Failed to create category');
    }
  }

  async findAll() {
    try {
      return await this.prisma.category.findMany();
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw new InternalServerErrorException('Failed to fetch categories');
    }
  }

  async findOneById(_id: number) {
    try {
      return await this.prisma.category.findUniqueOrThrow({
        where: {
          id: _id,
        },
      });
    } catch (error) {
      console.error('Error fetching category:', error);
      throw new InternalServerErrorException('Failed to fetch category');
    }
  }

  async updateById(_id: number, updateCategoryDto: UpdateCategoryDto) {
    try {
      return await this.prisma.category.update({
        where: {
          id: _id,
        },
        data: {
          name: updateCategoryDto.name,
          color: updateCategoryDto.color,
        },
      });
    } catch (error) {
      console.error('Error updating category:', error);
      throw new InternalServerErrorException('Failed to update category');
    }
  }

  async findOneByName(name: string) {
    try {
      return await this.prisma.category.findFirst({
        where: {
          name: name,
        },
      });
    } catch (error) {
      console.error('Error fetching category:', error);
      throw new InternalServerErrorException('Failed to fetch category');
    }
  }

  async remove(_id: number) {
    try {
      return await this.prisma.category.delete({
        where: {
          id: _id,
        },
      });
    } catch (error) {
      console.error('Error deleting category:', error);
      throw new InternalServerErrorException('Failed to delete category');
    }
  }

  createCategoryData(categoryName: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
    const colorCode: string = randomColor();
    return {
      name: categoryName,
      color: colorCode,
    };
  }

  async findMappingCategory(_id: number) {
    try {
      return await this.prisma.category.findFirst({
        where: {
          id: _id,
        },
        select: {
          timers: true,
        },
      });
    } catch (error) {
      console.error('Error fetching category:', error);
      throw new InternalServerErrorException('Failed to fetch category');
    }
  }
}
