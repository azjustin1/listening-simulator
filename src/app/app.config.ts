import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { apiInterceptor } from './interceptors/api.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(),
    provideAnimationsAsync(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([apiInterceptor])), provideClientHydration(),
  ],
};
