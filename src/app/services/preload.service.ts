import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of } from 'rxjs';
import { LazyLoadingService } from './lazy-loading.service';

@Injectable({
  providedIn: 'root'
})
export class PreloadService implements PreloadingStrategy {

  constructor(private lazyLoadingService: LazyLoadingService) {}

  preload(route: Route, load: () => Observable<any>): Observable<any> {
    // Estrategia de preload personalizada
    if (route.data && route.data['preload']) {
      return load();
    }
    
    // Preload inteligente basado en la ruta
    if (this.shouldPreload(route)) {
      return load();
    }
    
    return of(null);
  }

  private shouldPreload(route: Route): boolean {
    const path = route.path;
    
    // Preload de rutas críticas
    if (path === 'animales' || path === 'estadisticas') {
      return true;
    }
    
    // Preload basado en el tiempo de inactividad del usuario
    if (this.isUserIdle()) {
      return true;
    }
    
    return false;
  }

  private isUserIdle(): boolean {
    // Lógica para determinar si el usuario está inactivo
    // Por ahora, siempre retornamos false
    return false;
  }

  /**
   * Preload manual de módulos específicos
   */
  preloadModule(modulePath: string): void {
    this.lazyLoadingService.preloadModule(modulePath);
  }

  /**
   * Preload de múltiples módulos
   */
  preloadModules(modulePaths: string[]): void {
    modulePaths.forEach(path => {
      this.preloadModule(path);
    });
  }
} 