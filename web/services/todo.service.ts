import { Todo } from '../common/models/todo';
import { HttpService } from './http-abstract.service';

export interface ITodoService {
  getTodos(userUuid?: string): Promise<Todo[]>;
  getTodoById(todoUuid: string, userUuid?: string): Promise<Todo>;
  createTodo(todo: Todo, userUuid?: string): Promise<Todo>;
  updateTodoById(todo: Todo, todoUuid?: string, userUuid?: string): Promise<Todo>;
  deleteTodoById(todoUuid?: string, userUuid?: string): Promise<Todo>;
}

export class TodoService extends HttpService implements ITodoService {
  async getTodos(userUuid?: string): Promise<Todo[]> {
    return await this.get<Todo[]>(`/api/todos/${userUuid}`);
  }

  async getTodoById(todoUuid: string, userUuid?: string): Promise<Todo> {
    return await this.get<Todo>(`/api/todos/${userUuid}/${todoUuid}`);
  }

  async createTodo(todo: Todo, userUuid?: string): Promise<Todo> {
    return await this.post<Todo>(`/api/todos/${userUuid}`, todo);
  }

  async updateTodoById(todo: Todo, todoUuid?: string, userUuid?: string): Promise<Todo> {
    return await this.put<Todo>(`/api/todos/${userUuid}/${todoUuid}`, todo);
  }

  async deleteTodoById(todoUuid?: string, userUuid?: string): Promise<Todo> {
    return await this.delete<Todo>(`/api/todos/${userUuid}/${todoUuid}`);
  }
}
