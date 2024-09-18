import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';

export const teacherGuard: CanActivateFn = (route, state) => {
  return inject(AuthService).isLogin();
};
