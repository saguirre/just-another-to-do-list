import { createContext } from 'react';
import { ITodoService } from '../../services/todo.service';

export interface IServiceContext {
  todoService: ITodoService | null;
}

export const ServiceContext = createContext<IServiceContext>({
  todoService: null,
});
