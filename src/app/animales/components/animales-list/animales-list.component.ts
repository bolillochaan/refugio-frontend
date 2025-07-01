// components/animales-list/animales-list.component.ts
import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

import { MaterialModule } from '../../../shared/material.module';
import { AnimalService } from '../../../services/animal.service';
import { Animal } from '../../../models/animal.model';
import { LazyImageComponent } from '../../../components/lazy-image/lazy-image.component';

@Component({
  selector: 'app-animales-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    LazyImageComponent
  ],
  templateUrl: './animales-list.component.html',
  styleUrls: ['./animales-list.component.css']
})
export class AnimalesListComponent implements OnInit {
  animales: Animal[] = [];
  loading = false;
  searchTerm = '';
  currentPage = 0;
  pageSize = 12;
  totalElements = 0;
  fotoUrls: { [id: number]: string } = {};

  constructor(
    private animalService: AnimalService,
    private router: Router,
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.cargarAnimales();
  }

  cargarAnimales(): void {
    this.loading = true;
    this.animalService.obtenerAnimales(this.currentPage, this.pageSize)
      .subscribe({
        next: (response: any) => {
          this.animales = response.content;
          this.totalElements = response.totalElements;
          this.loading = false;
        },
        error: (error: any) => {
          console.error('Error al cargar animales:', error);
          this.loading = false;
        }
      });
  }

  buscarAnimales(): void {
    this.currentPage = 0;
    this.cargarAnimales();
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.cargarAnimales();
  }

  verDetalles(animalId: number): void {
    this.router.navigate(['/animales/detalle', animalId]);
  }

  editarAnimal(animalId: number): void {
    this.router.navigate(['/animales/editar', animalId]);
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
        return 'primary';
    }
  }

  getFotoUrl(animal: Animal): string {
    if (!animal) return '/assets/placeholder-animal.jpg';

    // Si ya la tenemos en cache, la devolvemos
    if (this.fotoUrls[animal.animalId!]) {
      return this.fotoUrls[animal.animalId!];
    }

    // Si el animal tiene fotoUrl directo, úsalo
    if (animal.fotoUrl) {
      this.fotoUrls[animal.animalId!] = animal.fotoUrl;
      return animal.fotoUrl;
    }

    // Si tiene id, obtenemos la url del endpoint
    if (animal.animalId) {
      this.http.get<{ fotoUrl: string }>(`/api/animales/${animal.animalId}/foto`).subscribe({
        next: (resp: { fotoUrl: string }) => {
          this.fotoUrls[animal.animalId!] = resp.fotoUrl;
        },
        error: () => {
          this.fotoUrls[animal.animalId!] = '/assets/placeholder-animal.jpg';
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