import { Module } from '@nestjs/common';
import { TimerController } from './timer.controller';
import { TimerService } from './timer.service';
import { PrismaService } from '../prisma.service';
import { CategoryService } from 'src/category/category.service';

@Module({
  controllers: [TimerController],
  providers: [TimerService, PrismaService, CategoryService],
})
export class TimerModule {}
