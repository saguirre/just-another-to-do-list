import { status, todoPriority } from '@prisma/client';
import { Tag } from './tag';

export interface Todo {
  id?: number;
  task?: string;
  description?: string;
  createdAt?: Date;
  userId?: string;
  updatedAt?: Date;
  tagsId?: string;
  status?: status;
  todosPriority?: todoPriority;
  projectId?: number;
  deleted?: boolean;
  position?: number;
  todoTags?: { tag: Tag }[];
  beingAdded?: boolean;
  beingUpdated?: boolean;
  beingSlashed?: boolean;
  beingRevived?: boolean;
  beingDeleted?: boolean;
}
