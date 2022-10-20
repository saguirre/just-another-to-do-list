import { Tag } from '../common/models/tag';
import { HttpService } from './http-abstract.service';

export interface ITagService {
  getTags(userUuid?: string): Promise<Tag[]>;
}

export class TagService extends HttpService implements ITagService {
  async getTags(userUuid?: string): Promise<Tag[]> {
    return await this.get<Tag[]>(`/api/tags/${userUuid}`);
  }
}
