import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';

jest.mock('bcrypt');
import * as bcrypt from 'bcrypt';

// Typed mock repository helper
type MockRepo<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const createMockRepo = <T>(): MockRepo<T> => ({
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
});

describe('UsersService', () => {
  let service: UsersService;
  let repo: MockRepo<User>;

  const mockUser: User = {
    id: 'user-uuid-1',
    email: 'test@example.com',
    name: 'Test User',
    password: 'hashed_password',
    tasks: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    repo = createMockRepo<User>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: repo },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);

    jest.clearAllMocks();
  });

  // ── create ─────────────────────────────────────────────────────────

  describe('create', () => {
    const dto = { email: 'test@example.com', name: 'Test User', password: 'password123' };

    it('should hash the password and return the new user', async () => {
      repo.findOne!.mockResolvedValue(null);
      repo.create!.mockReturnValue(mockUser);
      repo.save!.mockResolvedValue(mockUser);

      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed_password');

      const result = await service.create(dto);

      expect(bcrypt.hash).toHaveBeenCalledWith(dto.password, 12);
      expect(repo.save).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });

    it('should throw ConflictException if email already exists', async () => {
      repo.findOne!.mockResolvedValue(mockUser);

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
    });
  });

  // ── findByEmail ────────────────────────────────────────────────────

  describe('findByEmail', () => {
    it('should return a user when found', async () => {
      repo.findOne!.mockResolvedValue(mockUser);
      const result = await service.findByEmail('test@example.com');
      expect(result).toEqual(mockUser);
    });

    it('should return null when not found', async () => {
      repo.findOne!.mockResolvedValue(null);
      const result = await service.findByEmail('none@example.com');
      expect(result).toBeNull();
    });
  });

  // ── findById ───────────────────────────────────────────────────────

  describe('findById', () => {
    it('should return a user when found', async () => {
      repo.findOne!.mockResolvedValue(mockUser);
      const result = await service.findById('user-uuid-1');
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException when user does not exist', async () => {
      repo.findOne!.mockResolvedValue(null);
      await expect(service.findById('bad-id')).rejects.toThrow(NotFoundException);
    });
  });
});
