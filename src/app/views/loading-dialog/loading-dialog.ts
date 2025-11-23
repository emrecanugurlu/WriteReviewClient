import {Component, signal} from '@angular/core';
import {MatDialogContent} from '@angular/material/dialog';

@Component({
  selector: 'app-loading-dialog',
  imports: [
    MatDialogContent
  ],
  templateUrl: './loading-dialog.html',
  styleUrl: './loading-dialog.scss'
})
export class LoadingDialog {
  data = signal("Veriler Kaydediliyor....")
}
