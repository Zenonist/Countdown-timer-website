import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Timer, Prisma } from '../../generated/prisma';
import { CreateTimerDto } from './dto/create-timer.dto';
import { UpdateTimerDto } from './dto/update-timer.dto';
import { CategoryService } from 'src/category/category.service';

@Injectable()
export class TimerService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly category: CategoryService,
  ) {}

  async create(createTimerDto: CreateTimerDto): Promise<Timer> {
    const { dueDate, categoryName, ...rest } = createTimerDto;
    let categoryId: number = 0;

    if (!categoryName) {
      throw new BadRequestException('Either Category ID and Name is required');
    }

    try {
      const existingCategory = await this.category.findOneByName(categoryName);
      if (existingCategory) {
        categoryId = existingCategory.id;
      }

      if (!existingCategory) {
        const newCategoryData = this.category.createCategoryData(categoryName);
        const newCategory = await this.category.create(newCategoryData);
        categoryId = newCategory.id;
      }

      return this.prisma.timer.create({
        data: {
          ...rest,
          dueDate: new Date(dueDate),
          // This part is important because we need to connect the timer to the category
          // Otherwise, the timer will not be associated with the category
          category: {
            connect: {
              id: categoryId,
            },
          },
        },
        // Include the category data in the response
        include: {
          category: true,
        },
      });
    } catch (error) {
      // Check if it's a Prisma record not found error
      // P2025: "An operation failed because it depends on one or more records that were required but not found. {cause}"
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Category ID not found`);
      }
      // Re-throw other types of errors
      throw error;
    }
  }

  async findAll(): Promise<Timer[]> {
    return this.prisma.timer.findMany({
      // Include the category data in the response
      include: {
        category: true,
      },
    });
  }

  async findOne(id: number): Promise<Timer | null> {
    const timer = await this.prisma.timer.findUnique({
      where: { id },
      // Include the category data in the response
      include: {
        category: true,
      },
    });
    if (!timer) {
      throw new NotFoundException(`Timer with ID "${id}" not found`);
    }
    return timer;
  }

  async update(id: number, updateTimerDto: UpdateTimerDto): Promise<Timer> {
    const { dueDate, categoryName, ...rest } = updateTimerDto;
    // Prisma generates the `TimerUpdateInput` type based on schema.
    // Fields that are not required in the schema or explicitly marked optional
    // become optional properties in this type.
    const dataToUpdate: Prisma.TimerUpdateInput = { ...rest };

    if (categoryName) {
      const existingCategory = await this.category.findOneByName(categoryName);
      console.log(existingCategory);
      if (!existingCategory) {
        const categoryData = this.category.createCategoryData(categoryName);
        const newCategory = await this.category.create(categoryData);
        // In prisma schema, we declare category as a relation to timer
        // So we need to connect the timer to the category when i want to update the category of timer
        dataToUpdate.category = {
          connect: {
            id: newCategory.id,
          },
        };
      } else {
        dataToUpdate.category = {
          connect: {
            id: existingCategory.id,
          },
        };
      }
    }

    if (dueDate) {
      dataToUpdate.dueDate = new Date(dueDate);
    }

    console.log(dataToUpdate);

    try {
      return await this.prisma.timer.update({
        where: { id },
        data: dataToUpdate,
        include: {
          category: true,
        },
      });
    } catch (error) {
      // Check if it's a Prisma record not found error
      // P2025: "An operation failed because it depends on one or more records that were required but not found. {cause}"
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Timer with ID "${id}" not found`);
      }
      // Re-throw other types of errors
      throw error;
    }
  }
  async remove(id: number): Promise<Timer> {
    try {
      return await this.prisma.timer.delete({
        where: { id },
        include: {
          category: true,
        },
      });
    } catch (error) {
      // Check if it's a Prisma record not found error
      // P2025: "An operation failed because it depends on one or more records that were required but not found. {cause}"
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Timer with ID "${id}" not found`);
      }
      // Re-throw other types of errors
      throw error;
    }
  }
}
