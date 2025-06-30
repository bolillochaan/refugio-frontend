// services/animal.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Animal, AnimalResponse, EstadisticasResponse } from '../models/animal.model';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AnimalService {
  private apiUrl = 'http://localhost:3000/api/api/animales';

  constructor(private http: HttpClient) { }

  obtenerAnimales(page = 0, size = 10, sortBy = 'fechaIngreso', sortDir = 'desc'): Observable<AnimalResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('sortDir', sortDir);
    
    return this.http.get<AnimalResponse>(this.apiUrl, { params });
  }

  obtenerAnimalPorId(id: number): Observable<Animal> {
    return this.http.get<Animal>(`${this.apiUrl}/${id}`);
  }

  crearAnimal(animal: Animal): Observable<Animal> {
    return this.http.post<Animal>(this.apiUrl, animal);
  }

  actualizarAnimal(id: number, animal: Animal): Observable<Animal> {
    return this.http.put<Animal>(`${this.apiUrl}/${id}`, animal);
  }

  eliminarAnimal(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  buscarPorEspecie(especie: string, page = 0, size = 10): Observable<AnimalResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.http.get<AnimalResponse>(`${this.apiUrl}/especie/${especie}`, { params });
  }

  buscarPorNombre(nombre: string, page = 0, size = 10): Observable<AnimalResponse> {
    const params = new HttpParams()
      .set('nombre', nombre)
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.http.get<AnimalResponse>(`${this.apiUrl}/buscar`, { params });
  }

  obtenerEstadisticas(): Observable<EstadisticasResponse> {
    return this.http.get<EstadisticasResponse>(`${this.apiUrl}/estadisticas`);
  }

  obtenerAnimalesQueRequierenAtencion(): Observable<Animal[]> {
    return this.http.get<Animal[]>(`${this.apiUrl}/atencion-requerida`);
  }

  actualizarEstado(id: number, nuevoEstado: string): Observable<Animal> {
    return this.http.patch<Animal>(`${this.apiUrl}/${id}/estado`, { estadoSalud: nuevoEstado });
  }

  enviarCorreoAdopcion(animal: Animal): Observable<any> {
    return this.http.post(`${this.apiUrl}/${animal.id}/enviar-correo-adopcion`, animal);
  }
}