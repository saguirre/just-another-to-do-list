import { Tag } from '../common/models/tag';
import { Todo } from '../common/models/todo';
import { HttpService } from './http-abstract.service';

export interface ITodoService {
  getTodos(userUuid?: string): Promise<Todo[]>;
  getTodoById(todoId: number, userUuid?: string): Promise<Todo>;
  createTodo(todo: Todo, userUuid?: string, tags?: Tag[]): Promise<Todo>;
  updateTodoById(todo: Todo, todoId?: number, userUuid?: string): Promise<Todo>;
  deleteTodoById(todoId?: number, userUuid?: string): Promise<Todo>;
}

export class TodoService extends HttpService implements ITodoService {
  async getTodos(userUuid?: string): Promise<Todo[]> {
    return await this.get<Todo[]>(`/api/todos/${userUuid}`);
  }

  async getTodoById(todoId: number, userUuid?: string): Promise<Todo> {
    return await this.get<Todo>(`/api/todos/${userUuid}/${todoId}`);
  }

  async createTodo(todo: Todo, userUuid?: string, tags?: Tag[]): Promise<Todo> {
    return await this.post<Todo>(`/api/todos/${userUuid}`, { todo, tags });
  }

  async updateTodoById(todo: Todo, todoId?: number, userUuid?: string): Promise<Todo> {
    return await this.put<Todo>(`/api/todos/${userUuid}/${todoId}`, todo);
  }

  async deleteTodoById(todoId?: number, userUuid?: string): Promise<Todo> {
    return await this.delete<Todo>(`/api/todos/${userUuid}/${todoId}`);
  }
}
