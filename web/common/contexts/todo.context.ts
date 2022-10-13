import { createContext, Dispatch, SetStateAction } from 'react';
import { Todo } from '../models/todo';

export interface ITodoContext {
  todos: Todo[];
  setTodos: Dispatch<SetStateAction<Todo[]>>;
}

export const TodoContext = createContext<ITodoContext>({
  todos: [],
  setTodos: () => {},
});
