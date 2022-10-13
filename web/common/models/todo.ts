import { status } from "@prisma/client";

export interface Todo {
  id?: string;
  task?: string;
  description?: string;
  createdAt?: Date;
  userId?: string;
  updatedAt?: Date;
  tagsId?: string;
  todosPriorityId?: string;
  status?: status;
  projectId?: string;
  deleted?: boolean;
  beingAdded?: boolean;
  beingUpdated?: boolean;
  beingSlashed?: boolean;
  beingRevived?: boolean;
  beingDeleted?: boolean;
}
