import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArticleService, ArticleStatus } from '../../../../services/article/article-service';
import { ArticleDto } from '../../../../dto/article-dto';
import { CommonModule, DatePipe, NgClass } from '@angular/common';

@Component({
  selector: 'app-admin-article-detail',
  imports: [
    CommonModule,
    DatePipe,
    NgClass
  ],
  templateUrl: './admin-article-detail.html',
  styleUrl: './admin-article-detail.scss'
})
export class AdminArticleDetail {

  private loading = signal(false);
  private error = signal("");
  private ok = signal(false);

  articleService = inject(ArticleService);
  article = signal(<ArticleDto>{})
  private route = inject(ActivatedRoute);
  private id = signal("");

  constructor() {
    this.route.paramMap.subscribe(param => {
      this.id.set(<string>param.get("id"));
      this.fetchArticle();
    })
  }

  completedReviewsCount = computed(() => {
    return this.article().experts?.filter(e => e.status !== 0).length || 0;
  });

  getExpertStatusLabel(status: number): string {
    switch (status) {
      case 0: return 'Bekliyor';
      case 1: return 'Kabul Edildi';
      case 2: return 'Reddedildi';
      case 3: return 'Revizyon İstendi';
      default: return 'Bilinmiyor';
    }
  }

  getStatusLabel(): string {
    const status = this.article().status;
    const completed = this.completedReviewsCount();
    const total = this.article().experts?.length || 0;

    switch (status) {
      case ArticleStatus.Draft: return 'Taslak';
      case ArticleStatus.Submitted: return 'Editör İncelemesinde';
      case ArticleStatus.InReview: 
        if (total > 0 && completed >= total) {
          return 'Karar Bekleniyor (Raporlar Tamam)';
        }
        return 'Hakem İncelemesinde';
      case ArticleStatus.Approved: return 'Onaylandı';
      case ArticleStatus.Rejected: return 'Reddedildi';
      case ArticleStatus.RevisionsRequested: return 'Revizyon İstendi';
      default: return 'Bilinmiyor';
    }
  }

  getStatusClass(): string {
    const status = this.article().status;
    const completed = this.completedReviewsCount();
    const total = this.article().experts?.length || 0;

    switch (status) {
      case ArticleStatus.Submitted: return 'bg-amber-50 text-amber-700 border-amber-100';
      case ArticleStatus.InReview: 
        if (total > 0 && completed >= total) {
          return 'bg-blue-50 text-blue-700 border-blue-100';
        }
        return 'bg-indigo-50 text-indigo-700 border-indigo-100';
      case ArticleStatus.Approved: return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case ArticleStatus.Rejected: return 'bg-red-50 text-red-700 border-red-100';
      case ArticleStatus.RevisionsRequested: return 'bg-cyan-50 text-cyan-700 border-cyan-100';
      default: return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  }

  fetchArticle() {
    this.loading.set(true);
    this.articleService.getArticleWithId(this.id()).subscribe({
      next: (result) => {
        this.loading.set(false);
        this.ok.set(true);
        this.article.set(result);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set("Error: " + err.message);
        console.log(err);
      }
    })
  }
}
