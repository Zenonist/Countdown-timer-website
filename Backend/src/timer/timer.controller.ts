import { Controller, Get, Post, Body, Param, Delete, Patch, ParseIntPipe } from '@nestjs/common';
import { TimerService } from './timer.service';
import { CreateTimerDto } from './dto/create-timer.dto';
import { UpdateTimerDto } from './dto/update-timer.dto';
import { Timer } from '../../generated/prisma'; // Correct import path

@Controller('timer')
export class TimerController {
    constructor(private readonly timerService: TimerService) {}

  @Post()
  create(@Body() createTimerDto: CreateTimerDto): Promise<Timer> {
    return this.timerService.create(createTimerDto);
  }

  @Get()
  findAll(): Promise<Timer[]> {
    return this.timerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Timer | null> {
    return this.timerService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateTimerDto: UpdateTimerDto): Promise<Timer> {
    return this.timerService.update(id, updateTimerDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<Timer> {
    return this.timerService.remove(id);
  }
}
