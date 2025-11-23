import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from '../services/auth/auth-service';

/**
 * Kullanıcının giriş yapıp yapmadığını kontrol eden guard yapılanması, kullanıcı giriş yapmamış ise "login" sayfasına yönlendirme yapar.
 * @param route
 * @param state
 */
export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router)
  const authService = inject(AuthService);
  if (authService.isLoggedIn()) {
    return true;
  }
  console.error('Not logged in');
  return router.navigate(['/login']);
};
