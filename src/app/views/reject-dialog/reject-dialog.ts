import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { ArticleService } from '../../services/article/article-service';

@Component({
  selector: 'app-reject-dialog',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './reject-dialog.html',
  styleUrl: './reject-dialog.scss'
})
export class RejectDialog {
  readonly dialogRef = inject(MatDialogRef<RejectDialog>);
  readonly data = inject(MAT_DIALOG_DATA);
  readonly articleService = inject(ArticleService);

  reason = '';

  closeRejectDialog() {
    this.dialogRef.close();
  }

  confirmReject() {
    const articleId = this.data?.articleId;
    if (!articleId) {
      console.error('Article ID is missing');
      return;
    }

    if (!this.reason.trim()) {
      alert('Lütfen bir red nedeni giriniz.');
      return;
    }

    this.articleService.reject(articleId, { reason: this.reason }).subscribe({
      next: (res) => {
        alert('Makale başarıyla reddedildi.');
        this.dialogRef.close(true); // Return success
      },
      error: (err) => {
        console.error('Reddetme hatası:', err);
        alert('Makale reddedilirken bir hata oluştu.');
      }
    });
  }
}
