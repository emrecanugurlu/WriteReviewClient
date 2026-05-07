import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ArticleService } from '../../../../services/article/article-service';
import { PageResult } from '../../../../entities/interfaces/page-result';
import { ManagerArticleListItem } from '../../../../entities/interfaces/manager-article-list-item';

@Component({
  selector: 'app-articles',
  imports: [DatePipe, NgClass, FormsModule],
  templateUrl: './articles.html',
  styleUrl: './articles.scss'
})
export class Articles implements OnInit {
  Math = Math;
  router = inject(Router);
  articleService = inject(ArticleService);

  articles: PageResult<ManagerArticleListItem> = { page: 1, pageSize: 10, total: 0, items: [] };
  loading = signal(true);
  error = signal<string | null>(null);
  ok = signal(false);

  searchQuery = signal('');
  activeStatusFilter = signal<number | null>(null);

  currentPage = 1;
  itemsPerPage = 8;

  ngOnInit(): void {
    this.articleService.getAllArticles(1, 100).subscribe({
      next: (res) => {
        this.articles = res;
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

  filteredArticles = computed(() => {
    let items = this.articles.items;
    const q = this.searchQuery().toLowerCase().trim();
    const status = this.activeStatusFilter();

    if (q) {
      items = items.filter(a =>
        a.title.toLowerCase().includes(q) ||
        a.authorName.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q)
      );
    }
    if (status !== null) {
      items = items.filter(a => a.status === status);
    }
    return items;
  });

  countByStatus = (status: number) =>
    this.articles.items.filter(a => a.status === status).length;

  setStatusFilter(status: number | null) {
    this.activeStatusFilter.set(status);
    this.currentPage = 1;
  }

  get totalPages(): number {
    return Math.ceil(this.filteredArticles().length / this.itemsPerPage);
  }

  get pagedArticles(): ManagerArticleListItem[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredArticles().slice(start, start + this.itemsPerPage);
  }

  get visiblePages(): number[] {
    const total = this.totalPages;
    const current = this.currentPage;
    const delta = 1;
    const range: number[] = [];
    const rangeWithDots: number[] = [];
    let l: number | undefined;

    for (let i = 1; i <= total; i++) {
      if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
        range.push(i);
      }
    }
    range.forEach(i => {
      if (l) {
        if (i - l === 2) rangeWithDots.push(l + 1);
        else if (i - l !== 1) rangeWithDots.push(-1);
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

  getStatusLabel(status: number): string {
    switch (status) {
      case 0: return 'Taslak';
      case 1: return 'Bekleyen';
      case 2: return 'Hakemde';
      case 3: return 'Kabul Edildi';
      case 4: return 'Reddedildi';
      case 5: return 'Revizyon';
      default: return 'Bilinmiyor';
    }
  }

  goArticleDetail(articleId: string) {
    this.router.navigate(['/admin/article-detail', articleId]);
  }
}
