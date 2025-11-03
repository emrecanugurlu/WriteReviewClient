import {HttpInterceptorFn} from '@angular/common/http';
import {inject} from '@angular/core';
import {TokenService} from '../services/token/token-service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(TokenService).getToken();
  return token
    ? next(req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }))
    : next(req);
};
