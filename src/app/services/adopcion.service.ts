import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Adopcion } from '../models/adopcion.model';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AdopcionService {
  constructor(private apiService: ApiService) {}

  obtenerAdopciones(page = 0, size = 10): Observable<{ content: Adopcion[], totalElements: number, totalPages: number, size: number, number: number }> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.apiService.get<{ content: Adopcion[], totalElements: number, totalPages: number, size: number, number: number }>('/adopciones', params);
  }

  obtenerAdopcionPorId(id: number): Observable<Adopcion> {
    return this.apiService.get<Adopcion>(`/adopciones/${id}`);
  }

  crearAdopcion(adopcion: Adopcion): Observable<Adopcion> {
    return this.apiService.post<Adopcion>('/adopciones', adopcion);
  }

  actualizarAdopcion(id: number, adopcion: Adopcion): Observable<Adopcion> {
    return this.apiService.put<Adopcion>(`/adopciones/${id}`, adopcion);
  }

  eliminarAdopcion(id: number): Observable<void> {
    return this.apiService.delete<void>(`/adopciones/${id}`);
  }
}