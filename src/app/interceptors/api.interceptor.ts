import { HttpInterceptorFn } from '@angular/common/http';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const api = 'http://localhost:3000';
  const cloneReq = req.clone({ url: `${api}${req.url}` });
  return next(cloneReq);
};
