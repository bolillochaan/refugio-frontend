import { Adopcion } from './adopcion.model';

export interface Adoptante {
  adoptanteId?: number;
  nombre: string;
  direccion: string;
  telefono: string;
  adopciones?: Adopcion[];
  

  }