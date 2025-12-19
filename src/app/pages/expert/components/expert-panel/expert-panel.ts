import { Component, computed, inject, signal } from '@angular/core';
import { Expert } from '../../../../services/expert';
import { AssignedArticlesDto } from '../../../../dto/assigned-articles-dto';
import { PagedResult } from '../../../../dto/paged-result';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { AssignedArticeData } from '../../../../services/assigned-artice-data';

@Component({
  selector: 'app-expert-panel',
  imports: [
    DatePipe
  ],
  templateUrl: './expert-panel.html',
  styleUrl: './expert-panel.scss',
})
export class ExpertPanel {

  Math = Math;
  protected router = inject(Router);
  protected expertService = inject(Expert);
  protected pagedResult = signal<PagedResult<AssignedArticlesDto>>({
    page: 0,
    pageSize: 0,
    totalItems: 0,
    items: []
  });
  assignedArticles = signal<AssignedArticlesDto[]>([]);
  private assignedArticleDataService = inject(AssignedArticeData);

  currentPage = 1;
  itemsPerPage = 6;

  loading = signal(false);
  error = signal<string | null>(null);
  ok = signal(false);

  constructor() {
    this.loading.set(true);
    this.expertService.getAssignedArticles().subscribe({
      next: (res) => {
        console.log('Fetched articles:', res);
        this.assignedArticles.set(res.items);
        this.loading.set(false);
        this.ok.set(true);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set('Makale verileri alınırken bir hata oluştu.');
        console.error('Error fetching articles:', err);
      }
    });
  }

  get totalPages(): number {
    return Math.ceil(this.assignedArticles.length / this.itemsPerPage);
  }

  get visiblePages(): number[] {
    const total = this.totalPages;
    const current = this.currentPage;
    const delta = 1; // current sayfanın sağında ve solunda kaç sayfa görünsün
    const range: number[] = [];
    const rangeWithDots: any[] = [];
    let l: number | undefined;

    for (let i = 1; i <= total; i++) {
      if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
        range.push(i);
      }
    }

    range.forEach(i => {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push(-1); // -1 represents dots
        }
      }
      rangeWithDots.push(i);
      l = i;
    });

    return rangeWithDots;
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  goAssignedArticleDetail(article: AssignedArticlesDto): void {
    this.router.navigate(['/assigned-article-detail', article.articleId]);
  }

  getCategoryClass(category: string): string {
    const baseClasses = "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold transition-colors cursor-default ";

    switch (category) {
      case 'Dergi':
        return baseClasses + "bg-blue-50 text-blue-700 hover:bg-blue-100";
      case 'Gazete':
        return baseClasses + "bg-violet-50 text-violet-700 hover:bg-violet-100";
      case 'Olgu Sunumu':
        return baseClasses + "bg-rose-50 text-rose-700 hover:bg-rose-100";
      case 'Editöre Mektup':
        return baseClasses + "bg-emerald-50 text-emerald-700 hover:bg-emerald-100";
      case 'Makale':
      default:
        return baseClasses + "bg-slate-100 text-slate-600 hover:bg-slate-200";
    }
  }

  getStatusClass(status: string): string {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ";
    switch (status) {
      case 'pending': return baseClasses + "bg-yellow-50 text-yellow-700 border-yellow-200";
      case 'in-review': return baseClasses + "bg-purple-50 text-purple-700 border-purple-200";
      case 'revision': return baseClasses + "bg-orange-50 text-orange-700 border-orange-200";
      case 'accepted': return baseClasses + "bg-green-50 text-green-700 border-green-200";
      case 'rejected': return baseClasses + "bg-red-50 text-red-700 border-red-200";
      default: return baseClasses + "bg-slate-100 text-slate-700 border-slate-200";
    }
  }

  getStatusLabel(status: number): string {
    switch (status) {
      case 0: return 'Beklemede';
      case 1: return 'Hakemde';
      case 2: return 'Revizyon';
      case 3: return 'Kabul Edildi';
      case 4: return 'Reddedildi';
      default: return "Bilinmiyor";
    }
  }

}
