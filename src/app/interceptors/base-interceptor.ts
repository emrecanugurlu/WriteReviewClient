import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../environments/environment';

export const apiBaseInterceptor: HttpInterceptorFn = (req, next) => {
  const isAbsolute = req.url.startsWith('http://') || req.url.startsWith('https://');
  const url = isAbsolute ? req.url : `${environment.apiUrl}${req.url}`;
  return next(req.clone({ url }));
};
