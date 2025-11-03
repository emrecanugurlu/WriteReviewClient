import {ArticleStatus} from '../services/article/article-service';

export type ArticleDto = {
  id: string,
  title: string,
  status: ArticleStatus,
  updatedAt: string,
}
