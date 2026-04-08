import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../users/user.entity';
import { TaskStatus } from './task-status.enum';

@Entity('tasks')
export class Task {
  @ApiProperty({ example: 'uuid-v4' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'Implement authentication' })
  @Column({ length: 255 })
  title: string;

  @ApiProperty({ example: 'Add JWT-based auth to the API', required: false })
  @Column({ type: 'text', nullable: true })
  description: string | null;

  @ApiProperty({ enum: TaskStatus, example: TaskStatus.PENDING })
  @Column({ type: 'enum', enum: TaskStatus, default: TaskStatus.PENDING })
  status: TaskStatus;

  @ApiProperty({ example: '2026-12-31', required: false })
  @Column({ type: 'date', nullable: true })
  dueDate: Date | null;

  @ManyToOne(() => User, (user) => user.tasks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ApiProperty({ example: 'uuid-v4' })
  @Column()
  userId: string;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}
