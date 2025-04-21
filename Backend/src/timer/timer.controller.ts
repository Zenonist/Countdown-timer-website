import { Controller, Get, Post } from '@nestjs/common';
import { TimerService } from './timer.service';
import { Timer } from './interface/timer';

@Controller('timer')
export class TimerController {
    constructor(private readonly timerService: TimerService) {}
  @Get()
  getTimer(): Timer[] {
    return this.timerService.getAll();
  }

  @Post()
  createTimer(): string {
    return 'Timer created';
  }
}
