import { createContext } from 'react';
import { ITagService } from '../../services/tag.service';
import { ITodoService } from '../../services/todo.service';

export interface IServiceContext {
  todoService: ITodoService | null;
  tagService: ITagService | null;
}

export const ServiceContext = createContext<IServiceContext>({
  todoService: null,
  tagService: null,
});
