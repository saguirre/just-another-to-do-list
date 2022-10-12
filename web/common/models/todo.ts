import { TodoStatus } from './todo-status';

export interface Todo {
  id?: string;
  task?: string;
  description?: string;
  createdAt?: Date;
  status?: TodoStatus;
  statusId?: string;
}
