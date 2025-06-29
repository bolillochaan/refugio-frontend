// services/animal.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Animal, AnimalResponse, EstadisticasResponse } from '../models/animal.model';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AnimalService {
  constructor(private apiService: ApiService) {}

  obtenerAnimales(page = 0, size = 10, sortBy = 'fechaIngreso', sortDir = 'desc'): Observable<AnimalResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('sortDir', sortDir);
    
    return this.apiService.get<AnimalResponse>('/animales', params);
  }

  obtenerAnimalPorId(id: number): Observable<Animal> {
    return this.apiService.get<Animal>(`/animales/${id}`);
  }

  crearAnimal(animal: Animal): Observable<Animal> {
    return this.apiService.post<Animal>('/animales', animal);
  }

  actualizarAnimal(id: number, animal: Animal): Observable<Animal> {
    return this.apiService.put<Animal>(`/animales/${id}`, animal);
  }

  eliminarAnimal(id: number): Observable<void> {
    return this.apiService.delete<void>(`/animales/${id}`);
  }

  buscarPorEspecie(especie: string, page = 0, size = 10): Observable<AnimalResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.apiService.get<AnimalResponse>(`/animales/especie/${especie}`, params);
  }

  buscarPorNombre(nombre: string, page = 0, size = 10): Observable<AnimalResponse> {
    const params = new HttpParams()
      .set('nombre', nombre)
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.apiService.get<AnimalResponse>('/animales/buscar', params);
  }

  obtenerEstadisticas(): Observable<EstadisticasResponse> {
    return this.apiService.get<EstadisticasResponse>('/animales/estadisticas');
  }

  obtenerAnimalesQueRequierenAtencion(): Observable<Animal[]> {
    return this.apiService.get<Animal[]>('/animales/atencion-requerida');
  }
}