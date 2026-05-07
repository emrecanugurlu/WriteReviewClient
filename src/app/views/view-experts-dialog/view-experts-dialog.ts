import { CommonModule, NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface ViewExpertsDialogData {
  experts: { expertName: string, status: number, feedback?: string }[];
}

@Component({
  selector: 'app-view-experts-dialog',
  standalone: true,
  imports: [CommonModule, NgClass],
  templateUrl: './view-experts-dialog.html',
  styleUrls: ['./view-experts-dialog.scss']
})
export class ViewExpertsDialog {
  dialogRef = inject(MatDialogRef<ViewExpertsDialog>);
  data = inject<ViewExpertsDialogData>(MAT_DIALOG_DATA);

  closeDialog() {
    this.dialogRef.close();
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
}
