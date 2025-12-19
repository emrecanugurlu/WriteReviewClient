import {HttpClient, HttpParams} from '@angular/common/http';
import {AssignedArticlesDto} from '../dto/assigned-articles-dto';
import { inject, Injectable } from '@angular/core';
import { ExpertDto } from '../dto/experts-dto';
import { AddArticleExpertsDto } from '../dto/add-article-experts-dto';
import { PagedResult } from '../dto/paged-result';
import { AssignedArticleDto } from '../dto/assigned-article-dto';

@Injectable({
  providedIn: 'root'
})
export class Expert {
  http = inject(HttpClient);

  addArticleExperts(body : {articleId:string, expertsId:string[]}) {
    return this.http.post<string>('/api/experts',body)
  }

  getAssignedArticles(page = 1, pageSize = 10, status?: number) {
     const q = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
      ...(status !== undefined ? { status: String(status) } : {})
    }).toString();
    return this.http.get<PagedResult<AssignedArticlesDto>>(`/api/experts/get-assigned-articles/?${q}`);
  }

  getAssignedArticleDetail(articleId: string) {
    let params = new HttpParams().set('articleId', articleId);
    return this.http.get<AssignedArticleDto>(`/api/experts/get-assigned-article-detail/?${params.toString()}`);
  }

  getAllExperts(){
    return this.http.get<ExpertDto[]>(`/api/experts`)
  }
}


