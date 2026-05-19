import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ArticleService, ArticleStatus } from '../../../../services/article/article-service';
import { ArticleDto } from '../../../../dto/article-dto';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe, NgClass } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

type ActionType = 'approve' | 'reject' | 'revision' | null;

@Component({
  selector: 'app-article-detail',
  imports: [
    FormsModule,
    CommonModule,
    DatePipe,
    NgClass,
    RouterLink
  ],
  templateUrl: './article-detail.html',
  styleUrl: './article-detail.scss'
})
export class ArticleDetail {

  private articleService = inject(ArticleService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snackbar = inject(MatSnackBar);

  article = signal(<ArticleDto>{});
  loading = signal(false);
  error = signal('');

  private id = signal('');

  // Modal state
  activeDialog = signal<ActionType>(null);
  actionNote = '';
  processing = signal(false);

  constructor() {
    this.route.paramMap.subscribe(param => {
      this.id.set(param.get('id') ?? '');
      this.fetchArticle();
    });
  }

  completedReviewsCount = computed(() =>
    this.article().experts?.filter(e => e.status !== 0).length ?? 0
  );

  fetchArticle() {
    this.loading.set(true);
    this.articleService.getArticleWithId(this.id()).subscribe({
      next: (result) => {
        this.article.set(result);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Makale yüklenemedi.');
        this.loading.set(false);
      }
    });
  }

  getStatusLabel(): string {
    const status = this.article().status;
    const completed = this.completedReviewsCount();
    const total = this.article().experts?.length ?? 0;

    switch (status) {
      case ArticleStatus.Draft: return 'Taslak';
      case ArticleStatus.Submitted: return 'Editör İncelemesinde';
      case ArticleStatus.InReview:
        return total > 0 && completed >= total ? 'Karar Bekleniyor' : 'Hakem İncelemesinde';
      case ArticleStatus.Approved: return 'Onaylandı';
      case ArticleStatus.Rejected: return 'Reddedildi';
      case ArticleStatus.RevisionsRequested: return 'Revizyon İstendi';
      default: return 'Bilinmiyor';
    }
  }

  getStatusClass(): string {
    switch (this.article().status) {
      case ArticleStatus.Submitted: return 'bg-amber-50 text-amber-700 border-amber-100';
      case ArticleStatus.InReview: return 'bg-indigo-50 text-indigo-700 border-indigo-100';
      case ArticleStatus.Approved: return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case ArticleStatus.Rejected: return 'bg-red-50 text-red-700 border-red-100';
      case ArticleStatus.RevisionsRequested: return 'bg-cyan-50 text-cyan-700 border-cyan-100';
      default: return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  }

  openAssignDialog() {
    this.router.navigate(['/assign-experts', this.id()]);
  }

  openViewExpertsDialog() {
    this.router.navigate(['/view-experts', this.id()]);
  }

  // ── Moderation ────────────────────────────────────────────────────────────

  openActionDialog(type: ActionType) {
    this.actionNote = '';
    this.activeDialog.set(type);
  }

  closeActionDialog() {
    this.activeDialog.set(null);
  }

  submitAction() {
    const type = this.activeDialog();
    if (!type) return;

    this.processing.set(true);
    const id = this.id();
    let req$;

    if (type === 'approve') {
      req$ = this.articleService.approve(id, { note: this.actionNote || null });
    } else if (type === 'reject') {
      req$ = this.articleService.reject(id, { reason: this.actionNote });
    } else {
      req$ = this.articleService.requestRevision(id, { note: this.actionNote });
    }

    req$.subscribe({
      next: () => {
        this.processing.set(false);
        this.closeActionDialog();
        const msg =
          type === 'approve' ? 'Makale onaylandı.' :
          type === 'reject'  ? 'Makale reddedildi.' :
                               'Revizyon talebi gönderildi.';
        this.snackbar.open(msg, 'Tamam', { duration: 3000 });
        this.fetchArticle();
      },
      error: () => {
        this.processing.set(false);
        this.snackbar.open('İşlem başarısız oldu.', 'Tamam', { duration: 3000 });
      }
    });
  }
}
