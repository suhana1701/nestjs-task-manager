import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Task } from '../tasks/task.entity';

@Entity('users')
export class User {
  @ApiProperty({ example: 'uuid-v4' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  @Column({ unique: true, length: 255 })
  email: string;

  @ApiProperty({ example: 'John Doe' })
  @Column({ length: 100 })
  name: string;

  @Exclude()
  @Column()
  password: string;

  @OneToMany(() => Task, (task) => task.user, { cascade: true })
  tasks: Task[];

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}
