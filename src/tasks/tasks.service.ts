import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  /**
   * Creates a new task owned by the authenticated user.
   */
  async create(createTaskDto: CreateTaskDto, userId: string): Promise<Task> {
    const task = this.taskRepository.create({
      ...createTaskDto,
      userId,
    });
    return this.taskRepository.save(task);
  }

  /**
   * Returns all tasks belonging to the authenticated user.
   */
  async findAll(userId: string): Promise<Task[]> {
    return this.taskRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Returns a single task by ID.
   * Throws NotFoundException if not found.
   * Throws ForbiddenException if the task belongs to another user.
   */
  async findOne(id: string, userId: string): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { id } });

    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    if (task.userId !== userId) {
      throw new ForbiddenException('You do not have access to this task');
    }

    return task;
  }

  /**
   * Updates a task. Only the owner can update.
   */
  async update(
    id: string,
    updateTaskDto: UpdateTaskDto,
    userId: string,
  ): Promise<Task> {
    const task = await this.findOne(id, userId);
    Object.assign(task, updateTaskDto);
    return this.taskRepository.save(task);
  }

  /**
   * Soft deletes a task. Only the owner can delete.
   */
  async remove(id: string, userId: string): Promise<{ message: string }> {
    const task = await this.findOne(id, userId);
    await this.taskRepository.remove(task);
    return { message: `Task "${id}" deleted successfully` };
  }
}
