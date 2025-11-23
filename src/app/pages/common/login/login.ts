import { Component } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    NgOptimizedImage
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  email = '';
  password = '';
  showPassword = false;
  isLoading = false;

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    this.isLoading = true;
    // Giriş işlemi simülasyonu
    setTimeout(() => {
      this.isLoading = false;
      // Angular ortamında window.alert kullanımı (demo için)
      alert(`Giriş denemesi: ${this.email}`);
    }, 1500);
  }
}
