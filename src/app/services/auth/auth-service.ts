import {inject, Injectable} from '@angular/core';
import {jwtDecode} from 'jwt-decode';
import {HttpClient} from '@angular/common/http';
import {map, Observable, tap} from 'rxjs';
import {CookieService} from '../cookie/cookie-service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private tokenKey = 'jwt';
  cookie_service = inject(CookieService)

  http = inject(HttpClient);

  setToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  clear(){
     localStorage.removeItem(this.tokenKey);
  }

  login(email: string, password: string): Observable<void> {
    return this.http.post<LoginResponse>('/api/auth/login', { email, password },{withCredentials : true}).pipe(
      map(res => res.token),
      tap(token => {
        localStorage.setItem(this.tokenKey, token);
        document.cookie = `jwt=${encodeURIComponent(token)}; Path=/; SameSite=Lax`;
      }),
      map(() => void 0)
    );
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const payload: any = jwtDecode(token);
      const now = Math.floor(Date.now() / 1000);
      return payload.exp > now;
    } catch {
      return false;
    }
  }


  logout() {
    localStorage.removeItem(this.tokenKey);
    this.cookie_service.delete(this.tokenKey);
    //this.router.navigate(['/login']);
  }


  getUserRole(): string | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const payload: any = jwtDecode(token);
      return payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || null;
    } catch {
      return null;
    }
  }
}
