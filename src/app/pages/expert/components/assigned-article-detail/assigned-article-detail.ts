import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Expert } from '../../../../services/expert';
import { AssignedArticleDto } from '../../../../dto/assigned-article-dto';
import { FormsModule } from '@angular/forms';
import { DatePipe, NgClass } from '@angular/common';

type DecisionType = 'accept' | 'revision' | 'reject' | null;

@Component({
  selector: 'app-assigned-article-detail',
  imports: [
    FormsModule,
    DatePipe,
    NgClass,
    RouterLink
  ],
  templateUrl: './assigned-article-detail.html',
  styleUrl: './assigned-article-detail.scss'
})
export class AssignedArticleDetail {

  private expertService = inject(Expert);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  private articleId = signal<string>('');
  assignedArticleDetail = signal<AssignedArticleDto | null>(null);
  loading = signal(false);
  error = signal('');

  activeDialog = signal<DecisionType>(null);
  reviewNote = '';
  showToast = signal(false);
  submitting = signal(false);

  constructor() {
    this.articleId.set(this.route.snapshot.paramMap.get('id') || '');
    this.loading.set(true);
    this.expertService.getAssignedArticleDetail(this.articleId()).subscribe({
      next: (res) => {
        this.assignedArticleDetail.set(res);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Makale detayı yüklenemedi.');
        this.loading.set(false);
      }
    });
  }

  getStatusLabel(status: number | undefined): string {
    switch (status) {
      case 0: return 'Değerlendirme Bekliyor';
      case 1: return 'Kabul Edildi';
      case 2: return 'Reddedildi';
      case 3: return 'Revizyon İstendi';
      default: return 'Bilinmiyor';
    }
  }

  openDialog(type: DecisionType) {
    this.reviewNote = '';
    this.activeDialog.set(type);
  }

  closeDialog() {
    this.activeDialog.set(null);
  }

  submitReview() {
    if (!this.activeDialog()) return;

    let status = 0;
    if (this.activeDialog() === 'accept') status = 1;
    if (this.activeDialog() === 'reject') status = 2;
    if (this.activeDialog() === 'revision') status = 3;

    this.submitting.set(true);
    this.expertService.sendFeedback(this.articleId(), this.reviewNote, status).subscribe({
      next: () => {
        this.submitting.set(false);
        this.closeDialog();
        this.showToast.set(true);
        setTimeout(() => {
          this.showToast.set(false);
          this.router.navigate(['/expert-panel']);
        }, 2000);
      },
      error: () => {
        this.submitting.set(false);
      }
    });
  }
}
