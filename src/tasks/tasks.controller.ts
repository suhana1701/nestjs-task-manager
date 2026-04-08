import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Task } from './task.entity';

type AuthRequest = Express.Request & { user: { id: string } };

@ApiTags('Tasks')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  /**
   * POST /tasks — Create a new task for the authenticated user.
   */
  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({ status: 201, description: 'Task created', type: Task })
  create(
    @Body() createTaskDto: CreateTaskDto,
    @Request() req: AuthRequest,
  ): Promise<Task> {
    return this.tasksService.create(createTaskDto, req.user.id);
  }

  /**
   * GET /tasks — Get all tasks for the authenticated user.
   */
  @Get()
  @ApiOperation({ summary: 'Get all tasks for the current user' })
  @ApiResponse({ status: 200, description: 'List of tasks', type: [Task] })
  findAll(@Request() req: AuthRequest): Promise<Task[]> {
    return this.tasksService.findAll(req.user.id);
  }

  /**
   * GET /tasks/:id — Get a single task by ID.
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get a task by ID' })
  @ApiParam({ name: 'id', description: 'Task UUID' })
  @ApiResponse({ status: 200, description: 'Task found', type: Task })
  @ApiResponse({ status: 404, description: 'Task not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: AuthRequest,
  ): Promise<Task> {
    return this.tasksService.findOne(id, req.user.id);
  }

  /**
   * PATCH /tasks/:id — Update a task partially.
   */
  @Patch(':id')
  @ApiOperation({ summary: 'Update a task' })
  @ApiParam({ name: 'id', description: 'Task UUID' })
  @ApiResponse({ status: 200, description: 'Task updated', type: Task })
  @ApiResponse({ status: 404, description: 'Task not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Request() req: AuthRequest,
  ): Promise<Task> {
    return this.tasksService.update(id, updateTaskDto, req.user.id);
  }

  /**
   * DELETE /tasks/:id — Delete a task.
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a task' })
  @ApiParam({ name: 'id', description: 'Task UUID' })
  @ApiResponse({ status: 200, description: 'Task deleted successfully' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: AuthRequest,
  ): Promise<{ message: string }> {
    return this.tasksService.remove(id, req.user.id);
  }
}
