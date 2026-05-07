import { Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { ArticleService } from '../../services/article/article-service';

@Component({
  selector: 'app-revision-dialog',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './revision-dialog.html',
})
export class RevisionDialog {
  readonly dialogRef = inject(MatDialogRef<RevisionDialog>);
  readonly data = inject(MAT_DIALOG_DATA);
  readonly articleService = inject(ArticleService);

  note = '';
  loading = false;
  success = false;

  get isValid(): boolean {
    return this.note.trim().length >= 10;
  }

  close() {
    this.dialogRef.close(this.success);
  }

  confirm() {
    if (!this.isValid) return;
    this.loading = true;
    this.articleService.requestRevision(this.data.articleId, { note: this.note }).subscribe({
      next: () => {
        this.loading = false;
        this.success = true;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}
