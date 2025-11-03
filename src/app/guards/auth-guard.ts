import { CanActivateFn } from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from '../services/auth/auth-service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  if (authService.isLoggedIn()) {
    return true;
  }
  console.error('Not logged in');
  return false;
};
