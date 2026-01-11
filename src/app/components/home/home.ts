import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { TopAppBar } from '../../views/top-app-bar/top-app-bar';
import { AuthService } from '../../services/auth/auth-service';
import { Login } from '../../pages/common/login/login';

@Component({
  selector: 'app-home',
  imports: [
    RouterOutlet,
    TopAppBar,
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {
  authService = inject(AuthService);
  isLoggedIn = signal(false)
  constructor() {
    this.isLoggedIn.set(this.authService.isLoggedIn());
  }
}
