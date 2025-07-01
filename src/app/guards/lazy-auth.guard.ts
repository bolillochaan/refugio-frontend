import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LazyLoadingService } from '../services/lazy-loading.service';

@Injectable({
  providedIn: 'root'
})
export class LazyAuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private lazyLoadingService: LazyLoadingService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    
    // Lazy loading de servicios de autenticación si es necesario
    return new Promise((resolve) => {
      // Aquí puedes implementar lógica de autenticación con lazy loading
      // Por ahora, permitimos el acceso
      resolve(true);
      
      // Ejemplo de lazy loading de servicios de auth:
      // this.lazyLoadingService.loadService('./services/auth.service')
      //   .subscribe(authService => {
      //     if (authService.isAuthenticated()) {
      //       resolve(true);
      //     } else {
      //       this.router.navigate(['/login']);
      //       resolve(false);
      //     }
      //   });
    });
  }
} 