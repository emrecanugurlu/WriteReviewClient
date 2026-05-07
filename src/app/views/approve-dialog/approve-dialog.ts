import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ArticleService } from '../../services/article/article-service';

@Component({
  selector: 'app-approve-dialog',
  standalone: true,
  imports: [],
  templateUrl: './approve-dialog.html',
})
export class ApproveDialog {
  readonly dialogRef = inject(MatDialogRef<ApproveDialog>);
  readonly data = inject(MAT_DIALOG_DATA);
  readonly articleService = inject(ArticleService);

  loading = false;
  success = false;

  close() {
    this.dialogRef.close(this.success);
  }

  confirm() {
    this.loading = true;
    this.articleService.approve(this.data.articleId).subscribe({
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
