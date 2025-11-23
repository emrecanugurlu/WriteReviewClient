import {Component, inject, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {AuthService} from '../../services/auth/auth-service';
import {Router} from '@angular/router';
import {TokenService} from '../../services/token/token-service';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-login',
  imports: [FormsModule, MatInput, MatFormField, MatLabel, MatButton],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login{
  tokenService = inject(TokenService);
  email = '';
  password = '';

  loading = signal(false);
  error = signal("");
  ok = signal(false);
  authService: AuthService = inject(AuthService);

  constructor(private http: HttpClient, private router: Router) {}

  login() {
    this.error.set("");
    this.ok.set(false);
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
        return '/staff/inbox';
      case 'Expert':
        return 'assigned-articles';
      default:
        return '/my-articles';
    }
  }

}
