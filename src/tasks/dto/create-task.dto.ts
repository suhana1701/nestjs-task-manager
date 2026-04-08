import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsDateString,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TaskStatus } from '../task-status.enum';

export class CreateTaskDto {
  @ApiProperty({ example: 'Implement authentication' })
  @IsString()
  @IsNotEmpty({ message: 'Title must not be empty' })
  @MaxLength(255, { message: 'Title must be at most 255 characters' })
  title: string;

  @ApiPropertyOptional({ example: 'Add JWT-based auth to the API' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: TaskStatus, default: TaskStatus.PENDING })
  @IsOptional()
  @IsEnum(TaskStatus, { message: 'Status must be PENDING, IN_PROGRESS, or DONE' })
  status?: TaskStatus;

  @ApiPropertyOptional({ example: '2026-12-31' })
  @IsOptional()
  @IsDateString({}, { message: 'Due date must be a valid ISO date string' })
  dueDate?: string;
}
