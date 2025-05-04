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
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
      const color: string = randomColor();
      return await this.prisma.category.create({
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

  async findAll() {
    try {
      return await this.prisma.category.findMany();
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw new InternalServerErrorException('Failed to fetch categories');
    }
  }

  findOneById(_id: number) {
    return this.prisma.category.findUniqueOrThrow({
      where: {
        id: _id,
      },
    });
  }

  updateById(_id: number, updateCategoryDto: UpdateCategoryDto) {
    return this.prisma.category.update({
      where: {
        id: _id,
      },
      data: {
        name: updateCategoryDto.name,
        color: updateCategoryDto.color,
      },
    });
  }

  findOneByName(name: string) {
    return this.prisma.category.findFirst({
      where: {
        name: name,
      },
    });
  }

  remove(_id: number) {
    return this.prisma.category.delete({
      where: {
        id: _id,
      },
    });
  }
}
