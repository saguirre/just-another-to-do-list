import { createContext, Dispatch, SetStateAction } from 'react';
import { Tag } from '../models/tag';

export interface ITagContext {
  tags: Tag[];
  setTags: Dispatch<SetStateAction<Tag[]>>;
}

export const TagContext = createContext<ITagContext>({
  tags: [],
  setTags: () => {},
});
