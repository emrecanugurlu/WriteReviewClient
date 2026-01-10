import {ArticleStatus} from '../services/article/article-service';

export type ArticleDto = {
  id: string,
  title: string,
  content: string,
  summary: string,
  status: ArticleStatus,
  updatedAt: string,
}
