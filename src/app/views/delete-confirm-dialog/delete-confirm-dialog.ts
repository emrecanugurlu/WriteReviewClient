import { Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';

export type DeleteConfirmData = {
  title: string;
  subtitle?: string;
  label?: string;       // dialog başlığı, örn: "Makaleyi Sil", "Kullanıcıyı Sil"
  successMessage?: string;
  deleteFn: () => Observable<unknown>;
};

@Component({
  selector: 'app-delete-confirm-dialog',
  standalone: true,
  imports: [MatDialogModule, MatSnackBarModule],
  templateUrl: './delete-confirm-dialog.html',
})
export class DeleteConfirmDialog {
  readonly dialogRef = inject(MatDialogRef<DeleteConfirmDialog>);
  readonly data = inject<DeleteConfirmData>(MAT_DIALOG_DATA);
  private _snackBar = inject(MatSnackBar);

  loading = signal(false);
  success = signal(false);

  close() {
    this.dialogRef.close(this.success());
  }

  confirm() {
    this.loading.set(true);
    this.data.deleteFn().subscribe({
      next: () => {
        this.loading.set(false);
        this.success.set(true);
        setTimeout(() => this.dialogRef.close(true), 1000);
      },
      error: () => {
        this.loading.set(false);
        this._snackBar.open('Silme işlemi başarısız oldu.', 'Kapat', { duration: 3000 });
      }
    });
  }
}
