import { HttpInterceptorFn } from '@angular/common/http';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const api = 'http://127.0.0.1:3000';
  const cloneReq = req.clone({ url: `${api}${req.url}` });
  return next(cloneReq);
};
