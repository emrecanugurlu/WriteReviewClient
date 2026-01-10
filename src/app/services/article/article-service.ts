import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CreateDraftDto} from '../../dto/create-draft-dto';
import {ArticleDto} from '../../dto/article-dto';
import {PageResult} from '../../entities/interfaces/page-result';
import {ArticleListItem} from '../../entities/interfaces/article-list-item';
import {StaffArticleListItem} from '../../entities/interfaces/staff-article-list-item';
import {ArticleReview} from '../../entities/interfaces/article-review';
import {AddArticleResponse} from '../../dto/add-article-response';

export enum ArticleStatus { Draft=0, Submitted, InReview, Approved, Rejected, RevisionsRequested }


@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  http = inject(HttpClient);

  /**
   * Veritabanından yazara ait yazıları pagination kullanarak çekmek için kullanılan fonksiyon.
   * @param page
   * @param pageSize
   */
  getMine(page = 1, pageSize = 10): Observable<PageResult<ArticleListItem>> {
    return this.http.get<PageResult<ArticleListItem>>('/api/articles/mine?page=' + page + '&pageSize=' + pageSize);
  }

  //Veritabanını taslak kaydetmek için kullanılan fonksiyon.
  createArticle(body : {articleDto: CreateDraftDto, isSubmit: Boolean}) {
    return this.http.post<AddArticleResponse>('/api/articles', body);
  }

  getArticleWithId(articleId:string){
    return this.http.get<ArticleDto>(`/api/articles/${articleId}`)
  }

  getStaffArticles(page = 1, pageSize = 10, status?: number) {
    const q = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
      ...(status !== undefined ? { status: String(status) } : {})
    }).toString();
    return this.http.get<PageResult<StaffArticleListItem>>(`/api/staffs/articles?${q}`);
  }

  takeToReview(id: string,body?: { note?: string | null }) {
    return this.http.post<{ id: string; status: number }>(`/api/staff/articles/${id}/review`, {});
  }

  approve(id: string,body?: { note?: string | null }) {
    return this.http.post<{ id: string; status: number }>(`/api/staff/articles/${id}/approve`, {});
  }

  reject(id: string,body: { reason: string }) {
    return this.http.post<{ id: string; status: number }>(`/api/staff/articles/${id}/reject`, body);
  }

  requestRevision(id: string,body: { note: string }) {
    return this.http.post<{ id: string; status: number }>(`/api/staff/articles/${id}/request-revision`, {});
  }

  getReviews(articleId: string) {
     return this.http.get<{articleId:string, staff:any[], experts:any[]}>(
    `/api/articles/${articleId}/reviews`
  );
    // return this.http.get<ArticleReview[]>(`/api/articles/${articleId}/reviews`);
  }


}
