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

import { AnimalService } from '../../services/animal.service';
import { Animal } from '../../models/animal.model';

@Component({
  selector: 'app-animales-list',
  standalone: true,
  templateUrl: './animales-list.html',
  styleUrls: ['./animales-list.css'],
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

  constructor(
    private animalService: AnimalService,
    private router: Router,
    private snackBar: MatSnackBar
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
    this.router.navigate(['/animales', id]);
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

  private mostrarError(mensaje: string): void {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }
}