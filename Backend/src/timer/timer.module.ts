import { Module } from '@nestjs/common';
import { TimerController } from './timer.controller';
import { TimerService } from './timer.service';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [TimerController],
  providers: [TimerService, PrismaService],
})
export class TimerModule {}
