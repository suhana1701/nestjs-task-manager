import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

describe('TasksController', () => {
  let controller: TasksController;
  let service: jest.Mocked<TasksService>;

  const OWNER_ID = 'owner-uuid-1';
  const TASK_ID = 'task-uuid-1';

  const mockTask: Task = {
    id: TASK_ID,
    title: 'Test Task',
    description: 'A test task',
    status: TaskStatus.PENDING,
    dueDate: null,
    userId: OWNER_ID,
    user: {} as any,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockRequest = { user: { id: OWNER_ID } } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TasksController>(TasksController);
    service = module.get(TasksService);
  });

  afterEach(() => jest.clearAllMocks());

  // ── create ─────────────────────────────────────────────────────────

  describe('create', () => {
    it('should call service.create and return the new task', async () => {
      service.create.mockResolvedValue(mockTask);
      const dto: CreateTaskDto = { title: 'Test Task', description: 'A test task' };

      const result = await controller.create(dto, mockRequest);

      expect(service.create).toHaveBeenCalledWith(dto, OWNER_ID);
      expect(result).toEqual(mockTask);
    });
  });

  // ── findAll ────────────────────────────────────────────────────────

  describe('findAll', () => {
    it('should call service.findAll and return task list', async () => {
      service.findAll.mockResolvedValue([mockTask]);

      const result = await controller.findAll(mockRequest);

      expect(service.findAll).toHaveBeenCalledWith(OWNER_ID);
      expect(result).toHaveLength(1);
    });
  });

  // ── findOne ────────────────────────────────────────────────────────

  describe('findOne', () => {
    it('should return the task for valid id and owner', async () => {
      service.findOne.mockResolvedValue(mockTask);

      const result = await controller.findOne(TASK_ID, mockRequest);

      expect(service.findOne).toHaveBeenCalledWith(TASK_ID, OWNER_ID);
      expect(result).toEqual(mockTask);
    });

    it('should propagate NotFoundException from service', async () => {
      service.findOne.mockRejectedValue(new NotFoundException());
      await expect(controller.findOne('bad-id', mockRequest)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // ── update ─────────────────────────────────────────────────────────

  describe('update', () => {
    it('should call service.update and return the updated task', async () => {
      const updated = { ...mockTask, title: 'Updated' };
      service.update.mockResolvedValue(updated);
      const dto: UpdateTaskDto = { title: 'Updated' };

      const result = await controller.update(TASK_ID, dto, mockRequest);

      expect(service.update).toHaveBeenCalledWith(TASK_ID, dto, OWNER_ID);
      expect(result.title).toBe('Updated');
    });

    it('should propagate ForbiddenException from service', async () => {
      service.update.mockRejectedValue(new ForbiddenException());
      await expect(
        controller.update(TASK_ID, { title: 'Hack' }, mockRequest),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  // ── remove ─────────────────────────────────────────────────────────

  describe('remove', () => {
    it('should call service.remove and return the success message', async () => {
      service.remove.mockResolvedValue({ message: `Task "${TASK_ID}" deleted successfully` });

      const result = await controller.remove(TASK_ID, mockRequest);

      expect(service.remove).toHaveBeenCalledWith(TASK_ID, OWNER_ID);
      expect(result.message).toContain(TASK_ID);
    });
  });
});
