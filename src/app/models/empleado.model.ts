import { HistorialMedico } from './historialmedico.model';
import { Vacuna } from './vacuna.model';

export type PuestoEmpleado = 'VETERINARIO' | 'CUIDADOR' | 'ADMINISTRATIVO';

export interface Empleado {
  empleadoId?: number;
  nombre: string;
  puesto: PuestoEmpleado;
  fechaContratacion: Date;
  historialesMedicos?: HistorialMedico[];
  vacunas?: Vacuna[];
}