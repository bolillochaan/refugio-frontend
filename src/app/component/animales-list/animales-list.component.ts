// components/animales-list/animales-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule, SlicePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PageEvent } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule } from '@angular/material/paginator';
import { HttpClient } from '@angular/common/http';

import { AnimalService } from '../../services/animal.service';
import { Animal } from '../../models/animal.model';

@Component({
  selector: 'app-animales-list',
  standalone: true,
  templateUrl: './animales-list.component.html',
  styleUrls: ['./animales-list.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    SlicePipe,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatPaginatorModule
  ]
})
export class AnimalesListComponent implements OnInit {
  animales: Animal[] = [];
  loading = false;
  searchTerm = '';
  totalElements = 0;
  pageSize = 12;
  currentPage = 0;
  pageIndex = 0;
  fotoUrls: { [id: number]: string } = {};

  constructor(
    private animalService: AnimalService,
    private router: Router,
    private snackBar: MatSnackBar,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.cargarAnimales();
  }

  cargarAnimales(): void {
    this.loading = true;
    this.animalService.obtenerAnimales(this.currentPage, this.pageSize)
      .subscribe({
        next: (response) => {
          this.animales = response.content;
          this.totalElements = response.totalElements;
          this.loading = false;
        },
        error: (error) => {
          this.mostrarError('Error al cargar animales');
          this.loading = false;
        }
      });
  }

  buscarAnimales(): void {
    if (this.searchTerm.trim()) {
      this.loading = true;
      this.animalService.buscarPorNombre(this.searchTerm, 0, this.pageSize)
        .subscribe({
          next: (response) => {
            this.animales = response.content;
            this.totalElements = response.totalElements;
            this.currentPage = 0;
            this.loading = false;
          },
          error: () => {
            this.mostrarError('Error al buscar animales');
            this.loading = false;
          }
        });
    } else {
      this.cargarAnimales();
    }
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  verDetalles(id: number): void {
    this.router.navigate(['/animales/detalle', id]);
  }

  editarAnimal(id: number): void {
    this.router.navigate(['/animales/editar', id]);
  }

  crearAnimal(): void {
    this.router.navigate(['/animales/crear']);
  }

  getEstadoColor(estado: string): string {
    switch (estado) {
      case 'SALUDABLE':
        return 'primary';
      case 'EN_TRATAMIENTO':
        return 'accent';
      case 'CRITICO':
        return 'warn';
      default:
        return '';
    }
  }

  getFotoUrl(animal: any): string {
    if (!animal) return '/assets/placeholder-animal.jpg';

    // Si ya la tenemos en cache, la devolvemos
    if (this.fotoUrls[animal.animalId]) {
      return this.fotoUrls[animal.animalId];
    }

    // Si el animal tiene fotoUrl directo, úsalo
    if (animal.fotoUrl) {
      this.fotoUrls[animal.animalId] = animal.fotoUrl;
      return animal.fotoUrl;
    }

    // Si tiene id, obtenemos la url del endpoint
    if (animal.animalId) {
      this.http.get<{ fotoUrl: string }>(`/api/animales/${animal.animalId}/foto`).subscribe({
        next: (resp) => {
          this.fotoUrls[animal.animalId] = resp.fotoUrl;
        },
        error: () => {
          this.fotoUrls[animal.animalId] = '/assets/placeholder-animal.jpg';
        }
      });
      // Mientras carga, muestra placeholder
      return '/assets/placeholder-animal.jpg';
    }

    return '/assets/placeholder-animal.jpg';
  }

  private mostrarError(mensaje: string): void {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }
}