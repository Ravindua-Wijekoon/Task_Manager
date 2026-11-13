import { Injectable, NotFoundException } from '@nestjs/common';
import { Task } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  // Newest tasks first
  findAll(): Promise<Task[]> {
    return this.prisma.task.findMany({ orderBy: { createdAt: 'desc' } });
  }

  // Throws a 404 if there is no task with this id
  async findOne(id: number): Promise<Task> {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }
    return task;
  }

  create(dto: CreateTaskDto): Promise<Task> {
    return this.prisma.task.create({
      data: {
        ...dto,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
      },
    });
  }

  async update(id: number, dto: UpdateTaskDto): Promise<Task> {
    await this.findOne(id); // 404 first if the task is missing

    return this.prisma.task.update({
      where: { id },
      data: {
        ...dto,
        // undefined = leave as is, null = clear it, string = new date
        dueDate:
          dto.dueDate === undefined || dto.dueDate === null
            ? dto.dueDate
            : new Date(dto.dueDate),
      },
    });
  }

  async remove(id: number): Promise<Task> {
    await this.findOne(id); // 404 first if the task is missing

    return this.prisma.task.delete({ where: { id } });
  }
}
