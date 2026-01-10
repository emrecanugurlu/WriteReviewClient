import {Component, inject, model} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-reject-dialog',
  imports: [],
  templateUrl: './reject-dialog.html',
  styleUrl: './reject-dialog.scss'
})
export class RejectDialog {
  readonly dialogRef = inject(MatDialogRef<RejectDialog>);
  readonly data = inject(MAT_DIALOG_DATA);
  readonly animal = model(this.data.articleId);
  
  closeRejectDialog() {
    this.dialogRef.close();
  }

  confirmReject() {
    alert('Makale reddedildi.');
    this.closeRejectDialog();
  }
}
