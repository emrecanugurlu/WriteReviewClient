import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ArticleListItem } from '../../../../entities/interfaces/article-list-item';
import { ArticleService } from '../../../../services/article/article-service';
import { PageResult } from '../../../../entities/interfaces/page-result';
import { ManagerArticleListItem } from '../../../../entities/interfaces/manager-article-list-item';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-manager-panel',
  imports: [DatePipe],
  templateUrl: './manager-panel.html',
  styleUrl: './manager-panel.scss',
})
export class ManagerPanel implements OnInit {
  Math = Math;
  router = inject(Router);
  articles : PageResult<ManagerArticleListItem> ={page:1,pageSize:10, total:0, items:[]}; 
  articleService = inject(ArticleService);
  loading = signal(false);
  error = signal<string | null>(null);
  ok = signal(false);
  

  // constructor() {
  //   this.articleService.getStaffArticles().subscribe({
  //     next: (res) => {
  //       console.log('Fetched articles:', res);
  //       this.articles.items = res.items;
  //       this.articles.page = res.page;
  //       this.articles.pageSize = res.pageSize;
  //       this.articles.total = res.total;
  //     },
  //     error: (err) => {
  //       console.error('Error fetching articles:', err);
  //     }
  //   });
  // }

  ngOnInit(): void {
    this.loading.set(true);
    this.articleService.getStaffArticles().subscribe({
      next: (res) => {
        console.log('Fetched articles:', res);
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



  // --- Pagination Logic ---
  currentPage = 1;
  itemsPerPage = 6;

  get totalPages(): number {
    return Math.ceil(this.articles.items.length / this.itemsPerPage);
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

  // --- Helper Functions ---

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
      case 1 : return 'Hakemde';
      case 2: return 'Revizyon';
      case 3: return 'Kabul Edildi';
      case 4: return 'Reddedildi';
      default: return "Bilinmiyor";
    }
  }

  goArticleDetail(articleId: string) {
    this.router.navigate(['/article-detail',articleId]).then(() => {});
  }
}
