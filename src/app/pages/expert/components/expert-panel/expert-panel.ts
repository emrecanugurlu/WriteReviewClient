import { Component, computed, inject, signal } from '@angular/core';
import { Expert } from '../../../../services/expert';
import { AssignedArticlesDto } from '../../../../dto/assigned-articles-dto';
import { PagedResult } from '../../../../dto/paged-result';
import { DatePipe, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AssignedArticeData } from '../../../../services/assigned-artice-data';

@Component({
  selector: 'app-expert-panel',
  imports: [DatePipe, NgClass, FormsModule, RouterLink],
  templateUrl: './expert-panel.html',
  styleUrl: './expert-panel.scss',
})
export class ExpertPanel {

  Math = Math;
  protected router = inject(Router);
  protected expertService = inject(Expert);
  assignedArticles = signal<AssignedArticlesDto[]>([]);
  private assignedArticleDataService = inject(AssignedArticeData);

  // Arama & Filtre
  searchQuery = signal('');
  activeStatusFilter = signal<number | null>(null);

  currentPage = 1;
  itemsPerPage = 8;

  loading = signal(false);
  error = signal<string | null>(null);
  ok = signal(false);

  constructor() {
    this.loading.set(true);
    this.expertService.getAssignedArticles().subscribe({
      next: (res) => {
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

  // Computed: Arama + Filtre
  filteredArticles = computed(() => {
    let items = this.assignedArticles();
    const q = this.searchQuery().toLowerCase().trim();
    const status = this.activeStatusFilter();

    if (q) {
      items = items.filter(a =>
        a.articleTitle.toLowerCase().includes(q) ||
        a.authorName.toLowerCase().includes(q) ||
        a.articleCategory.toLowerCase().includes(q)
      );
    }
    if (status !== null) {
      items = items.filter(a => a.status === status);
    }
    return items;
  });

  countByStatus = (status: number) =>
    this.assignedArticles().filter(a => a.status === status).length;

  setStatusFilter(status: number | null) {
    this.activeStatusFilter.set(status);
    this.currentPage = 1;
  }

  get totalPages(): number {
    return Math.ceil(this.filteredArticles().length / this.itemsPerPage);
  }

  get pagedArticles(): AssignedArticlesDto[] {
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

  goAssignedArticleDetail(article: AssignedArticlesDto): void {
    this.router.navigate(['/assigned-article-detail', article.articleId]);
  }

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
      case 0: return 'Bekleyen';
      case 1: return 'Kabul Edildi';
      case 2: return 'Reddedildi';
      case 3: return 'Revizyon';
      default: return 'Bilinmiyor';
    }
  }
}
