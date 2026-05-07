import {ArticleStatus} from '../services/article/article-service';

export type ArticleDto = {
  id: string,
  title: string,
  content: string,
  summary: string,
  category: string,
  authorName: string,
  status: ArticleStatus,
  updatedAt: string,
  experts?: { expertName: string, status: number, feedback?: string }[],
}
