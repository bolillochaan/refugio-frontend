import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withPreloading } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { lazyLoadingInterceptor } from './interceptors/lazy-loading.interceptor';
import { PreloadService } from './services/preload.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withPreloading(PreloadService) // Estrategia de preload personalizada
    ),
    provideHttpClient(
      withInterceptors([lazyLoadingInterceptor]) // Interceptor para lazy loading
    ),
    provideAnimations()
  ]
};
