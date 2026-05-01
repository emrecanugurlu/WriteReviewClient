import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ArticleService } from '../../../../services/article/article-service';
import { PageResult } from '../../../../entities/interfaces/page-result';
import { ManagerArticleListItem } from '../../../../entities/interfaces/manager-article-list-item';
import { DatePipe, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-manager-panel',
  imports: [DatePipe, NgClass, RouterLink, FormsModule],
  templateUrl: './manager-panel.html',
  styleUrl: './manager-panel.scss',
})
export class ManagerPanel implements OnInit {
  Math = Math;
  router = inject(Router);
  articles: PageResult<ManagerArticleListItem> = { page: 1, pageSize: 10, total: 0, items: [] };
  articleService = inject(ArticleService);
  loading = signal(false);
  error = signal<string | null>(null);
  ok = signal(false);

  // Arama & filtre
  searchQuery = signal('');
  activeStatusFilter = signal<number | null>(null); // null = Tümü

  ngOnInit(): void {
    this.loading.set(true);
    this.articleService.getStaffArticles().subscribe({
      next: (res) => {
        this.articles.items = res.items;
        this.articles.page = res.page;
        this.articles.pageSize = res.pageSize;
        this.articles.total = res.total;
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

  // --- Computed Filtreler ---
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

  // Durum sayıları (gerçek veriden)
  countByStatus = (status: number) =>
    this.articles.items.filter(a => a.status === status).length;

  setStatusFilter(status: number | null) {
    this.activeStatusFilter.set(status);
    this.currentPage = 1;
  }

  // --- Pagination ---
  currentPage = 1;
  itemsPerPage = 8;

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
    const rangeWithDots: any[] = [];
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

  // --- Yardımcılar ---
  getCategoryClass(category: string): string {
    const base = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ';
    switch (category) {
      case 'Dergi': return base + 'bg-blue-50 text-blue-700';
      case 'Gazete': return base + 'bg-violet-50 text-violet-700';
      case 'Olgu Sunumu': return base + 'bg-rose-50 text-rose-700';
      case 'Editöre Mektup': return base + 'bg-teal-50 text-teal-700';
      default: return base + 'bg-slate-100 text-slate-600';
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

  /** Hakem atanmamış + beklemede ise acil göster */
  isUrgent(article: ManagerArticleListItem): boolean {
    return article.status === 1 && (!article.experts || article.experts.length === 0);
  }

  goArticleDetail(articleId: string) {
    this.router.navigate(['/article-detail', articleId]).then(() => {});
  }
}
