import { Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ArticleService } from '../../../../services/article/article-service';
import { ArticleListItem } from '../../../../entities/interfaces/article-list-item';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-articles',
  imports: [
    NgClass,
    FormsModule,
    DatePipe
  ],
  templateUrl: './my-articles.html',
  styleUrl: './my-articles.scss',
})
export class MyArticles implements OnInit {

  api = inject(ArticleService)
  loading = signal(false);
  error = signal("");
  page = 1;
  pageSize = 10;
  total = 0;
  myArticles = signal<ArticleListItem[]>([]);
  router = inject(Router);

  get totalPages() { return Math.max(1, Math.ceil(this.total / this.pageSize)); }

  get pendingCount() { return this.myArticles().filter(a => a.status === 1 || a.status === 2 || a.status === 5).length; }
  get approvedCount() { return this.myArticles().filter(a => a.status === 3).length; }
  get draftCount() { return this.myArticles().filter(a => a.status === 0).length; }

  constructor() { }

  ngOnInit() {
    this.load();
  }

  prev() { if (this.page > 1) { this.page--; this.load(); } }
  next() { if (this.page < this.totalPages) { this.page++; this.load(); } }

  load() {
    this.loading.set(true);
    this.error.set("");
    this.api.getMine(this.page, this.pageSize).subscribe({
      next: r => {
        this.loading.set(false);
        this.myArticles.set(r.items);
        this.total = r.total;
      },
      error: e => {
        this.error.set('Liste alınamadı');
        this.loading.set(false); console.error(e);
      }
    });
  }

  goToProfile() {
    this.router.navigate(['/profile']).then(r => {
    });
  }

  addArticle() {
    this.router.navigate(['/new-article']).then(r => {
    });
  }

  getStatusInfo(s: number) {
    switch (s) {
      case 0: return { text: 'Taslak', color: '#e0e7ff', textColor: '#1e3a8a' };
      case 1: return { text: 'Gönderildi', color: '#dbeafe', textColor: '#1d4ed8' };
      case 2: return { text: 'İncelemede', color: '#fef3c7', textColor: '#92400e' };
      case 3: return { text: 'Onaylandı', color: '#dcfce7', textColor: '#166534' };
      case 4: return { text: 'Reddedildi', color: '#fee2e2', textColor: '#991b1b' };
      case 5: return { text: 'Düzeltme İstendi', color: '#fef9c3', textColor: '#854d0e' };
      default: return { text: 'Bilinmiyor', color: '#e5e7eb', textColor: '#374151' };
    }
  }

  goUpdateArticle(selectedItemId: string) {
    this.router.navigate(['/my-article-detail', selectedItemId]).then(r => { });
  }

  searchTerm = '';
  activeFilter = 'all';

  filters = [
    { id: 'all', label: 'Tümü' },
    { id: 'published', label: 'Yayında' },
    { id: 'review', label: 'İncelemede' },
    { id: 'draft', label: 'Taslaklar' }
  ];

  get filteredArticles() {
    if (!this.myArticles()) return [];
    return this.myArticles().filter(article => {
      const term = this.searchTerm ? this.searchTerm.toLowerCase() : '';
      const matchesSearch = !term ||
        (article.title && article.title.toLowerCase().includes(term));

      let matchesFilter = true;
      if (this.activeFilter === 'published') matchesFilter = article.status === 3;
      else if (this.activeFilter === 'review') matchesFilter = article.status === 2 || article.status === 1 || article.status === 5;
      else if (this.activeFilter === 'draft') matchesFilter = article.status === 0;

      return matchesSearch && matchesFilter;
    });
  }

  getStatusLabel(status: number): string {
    switch (status) {
      case 0: return 'Taslak';
      case 1: return 'Gönderildi';
      case 2: return 'İncelemede';
      case 3: return 'Onaylandı';
      case 4: return 'Reddedildi';
      case 5: return 'Revizyon İstendi';
      default: return "Bilinmiyor";
    }
  }
}
