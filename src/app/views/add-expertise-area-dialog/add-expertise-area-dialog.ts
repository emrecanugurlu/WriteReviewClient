import { Component, inject, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { ExpertiseArea } from '../../services/expertise-area/expertise-area';
import { CommonModule } from '@angular/common';

export type ExpertiseAreaDialogData = { id: string; name: string } | null;

@Component({
  selector: 'app-add-expertise-area-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-expertise-area-dialog.html',
  styleUrl: './add-expertise-area-dialog.scss'
})
export class AddExpertiseAreaDialog {
  private expertiseAreaService = inject(ExpertiseArea);
  private dialogRef = inject(MatDialogRef<AddExpertiseAreaDialog>);
  data: ExpertiseAreaDialogData = inject(MAT_DIALOG_DATA, { optional: true });

  isEditMode = !!this.data?.id;
  name = signal(this.data?.name ?? '');
  loading = signal(false);
  error = signal<string | null>(null);

  save() {
    const areaName = this.name().trim();
    if (!areaName) {
      this.error.set('Lütfen bir isim giriniz.');
      return;
    }

    this.loading.set(true);
    const request$: Observable<unknown> = this.isEditMode
      ? this.expertiseAreaService.updateExpertiseArea(this.data!.id, areaName)
      : this.expertiseAreaService.addExpertiseArea(areaName);

    request$.subscribe({
      next: () => {
        this.loading.set(false);
        this.dialogRef.close(true);
      },
      error: (err: { error?: { message?: string } }) => {
        this.loading.set(false);
        this.error.set(err?.error?.message ?? 'Bir hata oluştu. Lütfen tekrar deneyiniz.');
      }
    });
  }

  close() {
    this.dialogRef.close(false);
  }
}
