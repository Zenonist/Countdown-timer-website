import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Timer, Prisma } from '../../generated/prisma';
import { CreateTimerDto } from './dto/create-timer.dto';
import { UpdateTimerDto } from './dto/update-timer.dto';

@Injectable()
export class TimerService {
    constructor(private readonly prisma: PrismaService) {}

    async create(createTimerDto: CreateTimerDto): Promise<Timer> {
        const { dueDate, ...rest } = createTimerDto;
        return this.prisma.timer.create({
            data: {
                ...rest,
                dueDate: new Date(dueDate),
            },
        });
    }

    async findAll(): Promise<Timer[]> {
        return this.prisma.timer.findMany();
    }

    async findOne(id: number): Promise<Timer | null> {
        const timer = await this.prisma.timer.findUnique({
            where: { id },
        });
        if (!timer) {
            throw new NotFoundException(`Timer with ID "${id}" not found`);
        }
        return timer;
    }

    async update(id: number, updateTimerDto: UpdateTimerDto): Promise<Timer> {
        const { dueDate, ...rest } = updateTimerDto;
        const dataToUpdate: any = { ...rest };
        if (dueDate) {
            dataToUpdate.dueDate = new Date(dueDate);
        }

        try {
            return await this.prisma.timer.update({
                where: { id },
                data: dataToUpdate,
            });
        } catch (error) {
            // Check if it's a Prisma record not found error
            // P2025: "An operation failed because it depends on one or more records that were required but not found. {cause}"
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
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
            });
        } catch (error) {
            // Check if it's a Prisma record not found error
            // P2025: "An operation failed because it depends on one or more records that were required but not found. {cause}"
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                throw new NotFoundException(`Timer with ID "${id}" not found`);
            }
            // Re-throw other types of errors
            throw error;
        }
    }
}
