import { createContext, Dispatch, SetStateAction } from 'react';
import { Todo } from '../models/todo';

export interface ITodoContext {
  todos: Todo[];
  todoFilter: (todo: Todo) => boolean;
  filterActive: boolean;
  setTodoFilter: Dispatch<SetStateAction<(filterCondition: any) => boolean>>;
  setTodos: Dispatch<SetStateAction<Todo[]>>;
  setFilterActive: Dispatch<SetStateAction<boolean>>;
}

export const TodoContext = createContext<ITodoContext>({
  todos: [],
  filterActive: false,
  setFilterActive: () => {},
  setTodoFilter: () => {},
  todoFilter: (todo: Todo) => true,
  setTodos: () => {},
});
