// src/app/components/home/home.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AnimalService } from '../../services/animal.service';
import { Animal } from '../../models/animal.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  animalesRecientes: Animal[] = [];
  animalesAtencion: Animal[] = [];
  estadisticas = {
    totalAnimales: 0,
    animalesDisponibles: 0,
    animalesEnTratamiento: 0
  };
  loading = true;

  constructor(
    private animalService: AnimalService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarDatosIniciales();
  }

  cargarDatosIniciales(): void {
    // Cargar animales recientes
    this.animalService.obtenerAnimales(0, 6).subscribe({
      next: (response) => {
        this.animalesRecientes = response.content;
      },
      error: (error) => console.error('Error cargando animales recientes:', error)
    });

    // Cargar animales que requieren atención
    this.animalService.obtenerAnimalesQueRequierenAtencion().subscribe({
      next: (animales) => {
        this.animalesAtencion = animales.slice(0, 3);
      },
      error: (error) => console.error('Error cargando animales atención:', error)
    });

    // Cargar estadísticas
    this.animalService.obtenerEstadisticas().subscribe({
      next: (stats) => {
        this.estadisticas.totalAnimales = stats.totalAnimales;
        this.estadisticas.animalesDisponibles = stats.animalesDisponiblesAdopcion;
        this.estadisticas.animalesEnTratamiento = stats.animalesPorEstado['EN_TRATAMIENTO'] || 0;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error cargando estadísticas:', error);
        this.loading = false;
      }
    });
  }

  verTodosLosAnimales(): void {
    this.router.navigate(['/animales']);
  }

  verEstadisticas(): void {
    this.router.navigate(['/estadisticas']);
  }

  agregarAnimal(): void {
    this.router.navigate(['/animales/crear']);
  }
}