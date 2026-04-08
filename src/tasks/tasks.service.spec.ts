import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';

type MockRepo<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const createMockRepo = <T>(): MockRepo<T> => ({
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  remove: jest.fn(),
});

describe('TasksService', () => {
  let service: TasksService;
  let repo: MockRepo<Task>;

  const OWNER_ID = 'owner-uuid-1';
  const OTHER_ID = 'other-uuid-2';
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

  beforeEach(async () => {
    repo = createMockRepo<Task>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: getRepositoryToken(Task), useValue: repo },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  afterEach(() => jest.clearAllMocks());

  // ── create ─────────────────────────────────────────────────────────

  describe('create', () => {
    it('should create and return a task', async () => {
      repo.create!.mockReturnValue(mockTask);
      repo.save!.mockResolvedValue(mockTask);

      const result = await service.create(
        { title: 'Test Task', description: 'A test task' },
        OWNER_ID,
      );

      expect(repo.create).toHaveBeenCalledWith({
        title: 'Test Task',
        description: 'A test task',
        userId: OWNER_ID,
      });
      expect(result).toEqual(mockTask);
    });
  });

  // ── findAll ────────────────────────────────────────────────────────

  describe('findAll', () => {
    it('should return all tasks for the given user', async () => {
      repo.find!.mockResolvedValue([mockTask]);

      const result = await service.findAll(OWNER_ID);

      expect(repo.find).toHaveBeenCalledWith({
        where: { userId: OWNER_ID },
        order: { createdAt: 'DESC' },
      });
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(mockTask);
    });
  });

  // ── findOne ────────────────────────────────────────────────────────

  describe('findOne', () => {
    it('should return the task when owner requests it', async () => {
      repo.findOne!.mockResolvedValue(mockTask);
      const result = await service.findOne(TASK_ID, OWNER_ID);
      expect(result).toEqual(mockTask);
    });

    it('should throw NotFoundException when task does not exist', async () => {
      repo.findOne!.mockResolvedValue(null);
      await expect(service.findOne('bad-id', OWNER_ID)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException when a different user requests the task', async () => {
      repo.findOne!.mockResolvedValue(mockTask);
      await expect(service.findOne(TASK_ID, OTHER_ID)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  // ── update ─────────────────────────────────────────────────────────

  describe('update', () => {
    it('should update and return the task', async () => {
      const updated = { ...mockTask, title: 'Updated Title', status: TaskStatus.IN_PROGRESS };
      repo.findOne!.mockResolvedValue(mockTask);
      repo.save!.mockResolvedValue(updated);

      const result = await service.update(
        TASK_ID,
        { title: 'Updated Title', status: TaskStatus.IN_PROGRESS },
        OWNER_ID,
      );

      expect(result.title).toBe('Updated Title');
      expect(result.status).toBe(TaskStatus.IN_PROGRESS);
    });

    it('should throw ForbiddenException when a different user tries to update', async () => {
      repo.findOne!.mockResolvedValue(mockTask);
      await expect(
        service.update(TASK_ID, { title: 'Hack' }, OTHER_ID),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  // ── remove ─────────────────────────────────────────────────────────

  describe('remove', () => {
    it('should delete the task and return a success message', async () => {
      repo.findOne!.mockResolvedValue(mockTask);
      repo.remove!.mockResolvedValue(mockTask);

      const result = await service.remove(TASK_ID, OWNER_ID);

      expect(repo.remove).toHaveBeenCalledWith(mockTask);
      expect(result.message).toContain(TASK_ID);
    });

    it('should throw ForbiddenException when a different user tries to delete', async () => {
      repo.findOne!.mockResolvedValue(mockTask);
      await expect(service.remove(TASK_ID, OTHER_ID)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });
});
