import { Injectable, Type } from '@angular/core';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LazyLoadingService {

  constructor() { }

  /**
   * Carga lazy de componentes modales
   */
  loadModalComponent(componentPath: string): Observable<Type<any>> {
    return from(import(componentPath).then(m => m[Object.keys(m)[0]]));
  }

  /**
   * Carga lazy de servicios específicos
   */
  loadService(servicePath: string): Observable<any> {
    return from(import(servicePath).then(m => m[Object.keys(m)[0]]));
  }

  /**
   * Carga lazy de módulos completos
   */
  loadModule(modulePath: string): Observable<any> {
    return from(import(modulePath).then(m => m[Object.keys(m)[0]]));
  }

  /**
   * Preload de módulos para mejorar la experiencia del usuario
   */
  preloadModule(modulePath: string): void {
    import(modulePath).then(() => {
      console.log(`Módulo ${modulePath} precargado exitosamente`);
    }).catch(error => {
      console.error(`Error al precargar módulo ${modulePath}:`, error);
    });
  }
} 