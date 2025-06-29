// models/animal.model.ts
export interface Animal {
  animalId?: number;
  nombre: string;
  especie: string;
  raza: string;
  edadAproximada: number;
  peso: number;
  color: string;
  sexo: 'MACHO' | 'HEMBRA';
  estadoSalud: 'SALUDABLE' | 'EN_TRATAMIENTO' | 'CRITICO';
  fechaIngreso: Date;
  descripcion?: string;
  historialMedico?: string;
  disponibleAdopcion: boolean;
  fotoUrl?: string;
}

export interface AnimalResponse {
  content: Animal[];        // Aquí está el arreglo real de animales
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface EstadisticasResponse {
  totalAnimales: number;
  animalesPorEspecie: { [key: string]: number };
  animalesPorEstado: { [key: string]: number };
  animalesDisponiblesAdopcion: number;
}
