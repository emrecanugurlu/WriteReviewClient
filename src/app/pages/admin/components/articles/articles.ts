import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ArticleService } from '../../../../services/article/article-service';
import { PageResult } from '../../../../entities/interfaces/page-result';
import { ManagerArticleListItem } from '../../../../entities/interfaces/manager-article-list-item';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DeleteConfirmDialog } from '../../../../views/delete-confirm-dialog/delete-confirm-dialog';

@Component({
  selector: 'app-articles',
  imports: [DatePipe, NgClass, FormsModule, MatDialogModule, MatSnackBarModule],
  templateUrl: './articles.html',
  styleUrl: './articles.scss'
})
export class Articles implements OnInit {
  Math = Math;
  router = inject(Router);
  articleService = inject(ArticleService);
  private _snackBar = inject(MatSnackBar);
  private _dialog = inject(MatDialog);

  articles = signal<PageResult<ManagerArticleListItem>>({ page: 1, pageSize: 10, total: 0, items: [] });
  loading = signal(true);
  error = signal<string | null>(null);
  ok = signal(false);

  searchQuery = signal('');
  activeStatusFilter = signal<number | null>(null);

  currentPage = 1;
  itemsPerPage = 8;

  ngOnInit(): void {
    this.fetchArticles();
  }

  fetchArticles() {
    this.loading.set(true);
    this.articleService.getAllArticles(1, 1000).subscribe({
      next: (res) => {
        this.articles.set(res);
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

  deleteArticle(event: Event, article: ManagerArticleListItem) {
    event.stopPropagation();
    const dialogRef = this._dialog.open(DeleteConfirmDialog, {
      data: {
        label: 'Makaleyi Sil',
        title: article.title,
        successMessage: 'Makale Silindi',
        deleteFn: () => this.articleService.deleteArticle(article.id)
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.fetchArticles();
    });
  }

  filteredArticles = computed(() => {
    let items = this.articles().items;
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
    this.articles().items.filter(a => a.status === status).length;

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
