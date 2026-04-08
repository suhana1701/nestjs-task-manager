import { PartialType } from '@nestjs/swagger';
import { CreateTaskDto } from './create-task.dto';

/**
 * UpdateTaskDto inherits all fields from CreateTaskDto but makes them all optional.
 * This follows the standard PATCH partial update pattern.
 */
export class UpdateTaskDto extends PartialType(CreateTaskDto) {}
