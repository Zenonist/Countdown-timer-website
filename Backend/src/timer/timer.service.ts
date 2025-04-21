import { Injectable } from '@nestjs/common';
import { Timer } from './interface/timer';

@Injectable()
export class TimerService {
    private readonly timer: Timer[] = [
        {
            id: '1',
            title: 'Project Deadline',
            description: 'Finish the final report for the project.',
            dueDate: new Date('2025-05-15T23:59:59'),
            category: 'Work',
            isArchived: false,
        },
        {
            id: '2',
            title: 'Birthday Party Prep',
            description: 'Buy cake and decorations.',
            dueDate: new Date('2025-04-25T18:00:00'),
            category: 'Personal',
            isArchived: false,
        },
        {
            id: '3',
            title: 'Vacation Countdown',
            description: 'Trip to Hawaii!',
            dueDate: new Date('2025-07-01T08:00:00'),
            category: 'Travel',
            isArchived: false,
        },
        {
            id: '4',
            title: 'Old Task',
            description: 'Something already done.',
            dueDate: new Date('2024-01-10T10:00:00'),
            category: 'Work',
            isArchived: true,
        }
    ];

    getAll(): Timer[] {
        return this.timer;
    }
}
