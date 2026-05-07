import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from '../services/auth/auth-service';

/**
 * Kullanıcı eğer giriş yapmışsa login sayfasını görmesini engeller ve yetkisine uygun ana sayfaya yönlendirir.
 */
export const guestGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  
  if (authService.isLoggedIn()) {
    const role = authService.getUserRole();
    let defaultRoute = '/my-articles';
    
    switch (role) {
      case 'Admin':
        defaultRoute = '/admin';
        break;
      case 'Manager':
        defaultRoute = '/manager-panel';
        break;
      case 'Expert':
        defaultRoute = '/expert-panel';
        break;
      case 'Author':
        defaultRoute = '/my-articles';
        break;
    }
    
    return router.navigate([defaultRoute], {replaceUrl: true});
  }
  
  return true;
};
