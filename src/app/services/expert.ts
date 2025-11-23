import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AddArticleExpertDTO} from '../dto/add-article-expert-dto';
import {CreateDraftDto} from '../dto/create-draft-dto';
import {AssignedArticles} from '../pages/expert/assigned-articles/assigned-articles';
import {AssignedArticlesResponse} from '../dto/get-assigned-articles-dto';

@Injectable({
  providedIn: 'root'
})
export class Expert {
  http = inject(HttpClient);

  addArticleExpert(body : {articleId: string, expertId: string}){
    return this.http.post<string>('/api/experts',body)
  }

  addArticleExperts(body : {articleId: string, expertId: string}[]){
    return this.http.post<string>('/api/experts/add-assignments',body)
  }

  getAssignedArticles(){
    return this.http.get<AssignedArticlesResponse[]>(`/api/experts/get-assigned-articles`)
  }
}
