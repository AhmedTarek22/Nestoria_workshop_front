import { HttpInterceptorFn } from '@angular/common/http';
import { HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const token = localStorage.getItem('token');

  if (token) {
    const cleanToken = token.replace(/^"(.+)"$/, '$1');

    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${cleanToken}`,
      },
    });

    return next(clonedReq);
  }
  return next(req);
};
