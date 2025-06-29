import { Animal } from './animal.model';
import { Empleado } from './empleado.model';

export interface Vacuna {
  vacunaId?: number;
  animal: Animal;
  empleado: Empleado;
  nombreVacuna: string;
  fechaAplicacion: Date;
  fechaProximaVacuna?: Date;
  lote?: string;
}