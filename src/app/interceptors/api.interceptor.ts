import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { catchError, finalize, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { error } from '@angular/compiler-cli/src/transformers/util';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const spinner = inject(NgxSpinnerService);
  const authService = inject(AuthService);

  const cloneReq = req.clone({
    url: `${environment.api}/api${req.url}`,
    headers: req.headers.set(
      'Authorization',
      `Bearer ${authService.getToken()}`,
    ),
  });

  spinner.show();

  return next(cloneReq).pipe(
    catchError((e: HttpErrorResponse) => {
      if (e.status === 401) {
        authService.removeToken();
      }
      return throwError(() => e);
    }),
    finalize(() => {
      spinner.hide();
    }),
  );
};
