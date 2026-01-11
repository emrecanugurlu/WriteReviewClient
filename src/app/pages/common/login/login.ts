import {Component, inject, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgClass, NgOptimizedImage} from '@angular/common';
import {AuthService} from '../../../services/auth/auth-service';
import {TokenService} from '../../../services/token/token-service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  email = '';
  password = '';
  showPassword = false;

  loading = signal(false);
  error = signal("");
  ok = signal(false);
  authService: AuthService = inject(AuthService);
  tokenService = inject(TokenService);
  router = inject(Router);


  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    this.loading.set(true);
    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.ok.set(true);
        this.loading.set(false);
        console.log(this.tokenService.getToken());
        const role = this.authService.getUserRole()
        const defaultRoute = this.getDefaultRouteForRole(role)
        this.router.navigate([defaultRoute],{replaceUrl:true}).then(r => {});
      },
      error: (e) => {
        this.error.set('Giriş başarısız');
        this.loading.set(false);
        console.error(e); }
    });
  }

  private getDefaultRouteForRole(role: string | null): string {
    switch (role) {
      case 'Admin':
        return '/admin';
      case 'Manager':
        return '/manager-panel';
      case 'Expert':
        return '/expert-panel';
      case 'Author':
        return '/my-articles';
      default:
        return '/my-articles';
    }
  }
}
