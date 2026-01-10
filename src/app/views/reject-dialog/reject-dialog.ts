import {Component, inject, model, signal} from '@angular/core';
import {
  MAT_DIALOG_DATA, MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {MatFormField} from '@angular/material/form-field';
import {MatLabel} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import {MatInput} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {ArticleService} from '../../services/article/article-service';
import {LoadingDialog} from '../loading-dialog/loading-dialog';

@Component({
  selector: 'app-reject-dialog',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatFormField,
    MatLabel,
    FormsModule,
    MatInput,
    MatDialogActions,
    MatButton,
  ],
  templateUrl: './reject-dialog.html',
  styleUrl: './reject-dialog.scss'
})
export class RejectDialog {

  articleService = inject(ArticleService);
  readonly rejectDialogRef = inject(MatDialogRef<RejectDialog>);
  readonly loadingDialogRef = inject(MatDialogRef<LoadingDialog>);
  readonly dialog = inject(MatDialog);
  readonly data = inject<{articleId:string}>(MAT_DIALOG_DATA);
  readonly articleId = model(this.data.articleId);
  protected reason = signal("");

  onNoClick(): void {
    //this.rejectDialogRef.close();
    this.dialog.open(LoadingDialog, {}).afterClosed().subscribe({
      next: result => {
        console.log("Deneme");
      }
    })
  }

  rejectArticle(articleId: string , reason: string) {

    this.articleService.reject(articleId, {reason: reason}).subscribe({
      next : result => {
        console.log(result);
        this.loadingDialogRef.close();
        this.rejectDialogRef.close();
      },
      error: err => {
        console.log(err);
        this.loadingDialogRef.close();
        this.rejectDialogRef.close();
      }
    });

  }
}
