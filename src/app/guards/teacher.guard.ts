import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';

export const teacherGuard: CanActivateFn = (
  route,
  state,
): boolean | UrlTree => {
  const router = inject(Router);
  return inject(AuthService).isLogin() ? true : router.parseUrl('/login');
};
