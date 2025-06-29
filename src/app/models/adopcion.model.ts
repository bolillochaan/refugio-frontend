import { Animal } from './animal.model';
import { Adoptante } from './adoptante.model';

export type EstadoAdopcion = 'ACTIVA' | 'FINALIZADA' | 'CANCELADA';

export interface Adopcion {
  adopcionId?: number;
  animal: Animal;
  adoptante: Adoptante;
  fechaAdopcion: Date;
  estado: EstadoAdopcion;
}