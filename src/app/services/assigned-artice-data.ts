import { Injectable } from '@angular/core';
import { AssignedArticlesDto } from '../dto/assigned-articles-dto';

@Injectable({
  providedIn: 'root',
})
export class AssignedArticeData {
  private assignedArticle: AssignedArticlesDto = {
    articleId: '',
    articleTitle: '',
    authorName: '',
    articleCategory: '',
    status: 0,
    reviewedAt: ''
  };

  setAssignedArticle(article: AssignedArticlesDto) {
    this.assignedArticle = article;
  }
  getAssignedArticle() {
    return this.assignedArticle;
  }
  
}
