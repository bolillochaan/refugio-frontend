import { Animal } from './animal.model';
import { Empleado } from './empleado.model';

export interface HistorialMedico {
  historialId?: number;
  animal: Animal;
  empleado: Empleado;
  fechaConsulta: Date;
  diagnostico: string;
  tratamiento?: string;
}