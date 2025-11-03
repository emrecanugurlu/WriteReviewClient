import {Component, inject, Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Home} from '../../components/home/home';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  private _snackbar = inject(MatSnackBar)

  openSnackbar(message: string = "", action: string = "Kapat", duration: number = 5,) {
    this._snackbar.open(message, action ,{
      duration : duration,
    })
  }

}
