import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LazyLoadingService } from '../services/lazy-loading.service';

export const lazyLoadingInterceptor: HttpInterceptorFn = (request, next) => {
  const lazyLoadingService = inject(LazyLoadingService);
  
  // Preload de módulos basado en las peticiones HTTP
  preloadModulesBasedOnRequest(request, lazyLoadingService);
  
  return next(request);
};

function preloadModulesBasedOnRequest(request: any, lazyLoadingService: LazyLoadingService): void {
  const url = request.url;
  
  // Preload de módulos basado en endpoints
  if (url.includes('/animales')) {
    lazyLoadingService.preloadModule('./animales/animal.module');
  }
  
  if (url.includes('/estadisticas')) {
    lazyLoadingService.preloadModule('./estadisticas/estadisticas.module');
  }
  
  if (url.includes('/adopciones')) {
    // Preload de módulos relacionados con adopciones
    lazyLoadingService.preloadModule('./animales/animal.module');
  }
} 