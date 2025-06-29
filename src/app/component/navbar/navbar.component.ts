// components/navbar/navbar.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  template: `
    <mat-toolbar color="primary">
      <mat-icon>pets</mat-icon>
      <span style="margin-left: 8px;">Refugio de Animales</span>
      <span class="spacer"></span>
      <button mat-button (click)="navigateTo('/')">Inicio</button>
      <button mat-button (click)="navigateTo('/animales')">Animales</button>
      <button mat-button (click)="navigateTo('/estadisticas')">Estadísticas</button>
    </mat-toolbar>
  `,
  styles: [`
    .spacer {
      flex: 1 1 auto;
    }
  `]
})
export class NavbarComponent {
  constructor(private router: Router) {}

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}