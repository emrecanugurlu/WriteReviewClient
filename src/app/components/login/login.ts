import {Component, inject} from '@angular/core';
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

  loading = false;
  error = '';
  ok = false;
  authService: AuthService = inject(AuthService);

  constructor(private http: HttpClient, private router: Router) {}

  login() {
    this.error = ''; this.ok = false; this.loading = true;
    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.ok = true;
        this.loading = false;
        console.log(this.tokenService.getToken());
        this.router.navigate(['/my-articles'],{replaceUrl:true}).then(r => {});
        },
      error: (e) => { this.error = 'Giriş başarısız'; this.loading = false; console.error(e); }
    });
  }

}
