import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule, NgClass } from '@angular/common';
import { ArticleService } from '../../../../services/article/article-service';
import { ArticleDto } from '../../../../dto/article-dto';
import { MatDialog } from '@angular/material/dialog';
import { ApproveDialog } from '../../../../views/approve-dialog/approve-dialog';
import { RejectDialog } from '../../../../views/reject-dialog/reject-dialog';
import { RevisionDialog } from '../../../../views/revision-dialog/revision-dialog';

@Component({
  selector: 'app-view-experts',
  imports: [CommonModule, NgClass, RouterLink],
  templateUrl: './view-experts.html',
  styleUrl: './view-experts.scss'
})
export class ViewExperts implements OnInit {

  private route  = inject(ActivatedRoute);
  private router = inject(Router);
  private articleService = inject(ArticleService);
  private dialog = inject(MatDialog);

  // Route param
  articleId = signal('');

  // Data
  article = signal<ArticleDto | null>(null);
  loading = signal(true);
  error   = signal('');

  // ── Computed ────────────────────────────────────────────────

  experts = computed(() => {
    const art = this.article();
    return art?.experts || [];
  });

  pendingCount = computed(() => this.experts().filter(e => e.status === 0).length);
  acceptedCount = computed(() => this.experts().filter(e => e.status === 1).length);
  rejectedCount = computed(() => this.experts().filter(e => e.status === 2).length);
  completedCount = computed(() => this.experts().filter(e => e.status === 3).length);

  // Checks if any expert hasn't submitted their report or rejected the assignment yet
  isWaitingForExperts = computed(() => this.pendingCount() > 0);

  // ── Lifecycle ───────────────────────────────────────────────

  ngOnInit() {
    this.route.paramMap.subscribe(p => {
      const id = p.get('id');
      if (id) {
        this.articleId.set(id);
        this.fetchArticle();
      } else {
        this.error.set('Makale ID bulunamadı.');
        this.loading.set(false);
      }
    });
  }

  fetchArticle() {
    this.loading.set(true);
    this.error.set('');
    
    this.articleService.getArticleWithId(this.articleId()).subscribe({
      next: (res: ArticleDto) => {
        this.article.set(res);
        this.loading.set(false);
      },
      error: (err: any) => {
        this.error.set(err.message || 'Makale bilgileri alınamadı.');
        this.loading.set(false);
      }
    });
  }

  // ── Actions ─────────────────────────────────────────────────

  goBack() { 
    this.router.navigate(['/article-detail', this.articleId()]); 
  }

  getExpertStatusLabel(status: number): string {
    switch (status) {
      case 0: return 'Bekliyor';
      case 1: return 'Kabul Etti';
      case 2: return 'Reddetti';
      case 3: return 'Rapor İletildi';
      default: return 'Bilinmiyor';
    }
  }

  getExpertStatusClass(status: number): string {
    switch (status) {
      case 0: return 'status--pending';
      case 1: return 'status--accepted';
      case 2: return 'status--rejected';
      case 3: return 'status--completed';
      default: return 'status--unknown';
    }
  }

  getExpertStatusIcon(status: number): string {
    switch (status) {
      case 0: return 'hourglass_empty';
      case 1: return 'check_circle';
      case 2: return 'cancel';
      case 3: return 'description';
      default: return 'help';
    }
  }

  // ── Decisions ────────────────────────────────────────────────

  approveArticle() {
    const dialogRef = this.dialog.open(ApproveDialog, {
      data: { articleId: this.articleId() },
      width: '100%',
      maxWidth: '28rem',
      panelClass: 'modern-dialog'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.fetchArticle();
    });
  }

  requestRevision() {
    const dialogRef = this.dialog.open(RevisionDialog, {
      data: { articleId: this.articleId() },
      width: '100%',
      maxWidth: '32rem',
      panelClass: 'modern-dialog'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.fetchArticle();
    });
  }

  openRejectDialog() {
    const dialogRef = this.dialog.open(RejectDialog, {
      data: { articleId: this.articleId() },
      width: '100%',
      maxWidth: '28rem',
      panelClass: 'modern-dialog'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.fetchArticle();
    });
  }
}
