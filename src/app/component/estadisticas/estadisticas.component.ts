// src/app/components/estadisticas/estadisticas.component.ts

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, forkJoin, interval } from 'rxjs';
import { takeUntil, startWith, switchMap } from 'rxjs/operators';
import { Animal, AnimalResponse } from '../../models/animal.model';
import { Adopcion } from '../../models/adopcion.model';
import { AnimalService } from '../../services/animal.service';
import { AdopcionService } from '../../services/adopcion.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Material modules
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';



type Tendencia = 'up' | 'down' | 'stable';

interface MetricaTendencia {
  valor: number;
  tendencia: Tendencia;
  porcentajeCambio: number;
}

interface EstadisticasGenerales {
  totalAnimales: MetricaTendencia;
  animalesDisponibles: MetricaTendencia;
  animalesAdoptados: MetricaTendencia;
  adopcionesDelMes: MetricaTendencia;
  adopcionesDelAno: MetricaTendencia;
  tasaAdopcion: MetricaTendencia;
  animalesCriticos: MetricaTendencia;
  animalesEnTratamiento: MetricaTendencia;
}

interface EstadisticasPorEspecie {
  especie: string;
  total: number;
  disponibles: number;
  adoptados: number;
  porcentaje: number;
}

interface EstadisticasPorMes {
  mes: string;
  adopciones: number;
  ingresos: number;
}

@Component({
  selector: 'app-estadisticas',
  standalone: true,
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    MatRadioModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatCheckboxModule,
    MatDialogModule,
    MatButtonModule,
    MatTableModule
  ]
})
export class EstadisticasComponent implements OnInit, OnDestroy {
  tipoExport: string = 'pdf';
  nombreArchivo: string = '';

  // Propiedades adicionales para la tabla y métricas
  columnasTabla: string[] = ['especie', 'tasaAdopcion', 'acciones'];
  metricasTiempo: any = {
    tiempoPromedioAdopcion: 0,
    tiempoPromedioRecuperacion: 0,
    tiempoPromedioEstadia: 0
  };
  topAdopciones: any[] = [];
  alertas: any[] = [];

  private destroy$ = new Subject<void>();
  
  // Estados de carga
  loading = true;
  error = false;
  errorMessage = '';
  
  // Datos principales
  estadisticasGenerales: EstadisticasGenerales = {
    totalAnimales: { valor: 0, tendencia: 'stable', porcentajeCambio: 0 },
    animalesDisponibles: { valor: 0, tendencia: 'stable', porcentajeCambio: 0 },
    animalesAdoptados: { valor: 0, tendencia: 'stable', porcentajeCambio: 0 },
    adopcionesDelMes: { valor: 0, tendencia: 'stable', porcentajeCambio: 0 },
    adopcionesDelAno: { valor: 0, tendencia: 'stable', porcentajeCambio: 0 },
    tasaAdopcion: { valor: 0, tendencia: 'stable', porcentajeCambio: 0 },
    animalesCriticos: { valor: 0, tendencia: 'stable', porcentajeCambio: 0 },
    animalesEnTratamiento: { valor: 0, tendencia: 'stable', porcentajeCambio: 0 }
  };
  
  estadisticasPorEspecie: EstadisticasPorEspecie[] = [];
  estadisticasPorMes: EstadisticasPorMes[] = [];
  
  // Datos para gráficos
  chartDataEspecies: any[] = [];
  chartDataAdopciones: any[] = [];
  chartDataSalud: any[] = [];

  // Métricas de tendencia
  metricasTendencia: EstadisticasGenerales = {
    totalAnimales: { valor: 0, tendencia: 'stable', porcentajeCambio: 0 },
    animalesDisponibles: { valor: 0, tendencia: 'stable', porcentajeCambio: 0 },
    animalesAdoptados: { valor: 0, tendencia: 'stable', porcentajeCambio: 0 },
    adopcionesDelMes: { valor: 0, tendencia: 'stable', porcentajeCambio: 0 },
    adopcionesDelAno: { valor: 0, tendencia: 'stable', porcentajeCambio: 0 },
    tasaAdopcion: { valor: 0, tendencia: 'stable', porcentajeCambio: 0 },
    animalesCriticos: { valor: 0, tendencia: 'stable', porcentajeCambio: 0 },
    animalesEnTratamiento: { valor: 0, tendencia: 'stable', porcentajeCambio: 0 }
  };
  
  // Configuración de auto-refresh
  autoRefresh = true;
  refreshInterval = 300000; // 5 minutos
  
  // Filtros de fecha
  fechaInicio: Date = new Date(new Date().getFullYear(), 0, 1); // Inicio del año
  fechaFin: Date = new Date(); // Hoy
  
  // Nuevas propiedades para gráficos y detalles
  incluirGraficos = true;
  incluirDetalles = false;
  exportando = false;
  
  constructor(
    private animalService: AnimalService,
    private adopcionService: AdopcionService
  ) {}
  
  ngOnInit(): void {
    this.cargarDatosEjemplo();
    this.configurarAutoRefresh();
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  configurarAutoRefresh(): void {
    if (this.autoRefresh) {
      interval(this.refreshInterval)
        .pipe(
          startWith(0),
          switchMap(() => this.cargarDatos()),
          takeUntil(this.destroy$)
        )
        .subscribe();
    }
  }
  
  private cargarDatos() {
    return forkJoin({
      animales: this.animalService.obtenerAnimales(),
      adopciones: this.adopcionService.obtenerAdopciones()
    }).pipe(
      takeUntil(this.destroy$)
    );
  }

  cargarEstadisticas(): void {
    this.loading = true;
    this.error = false;

    this.cargarDatos().subscribe({
      next: ({ animales, adopciones }) => {
        // Extrae los arreglos reales de Animal[] y Adopcion[]
        this.procesarEstadisticasGenerales(animales.content, adopciones.content);
        this.procesarEstadisticasPorEspecie(animales.content);
        this.procesarEstadisticasPorMes(adopciones.content);
        this.calcularTendencias(animales.content, adopciones.content);
        this.prepararDatosGraficos();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar estadísticas:', error);
        this.error = true;
        this.errorMessage = 'Error al cargar las estadísticas. Por favor, intenta nuevamente.';
        this.loading = false;
      }
    });
  }
  
  private procesarEstadisticasGenerales(animales: Animal[], adopciones: Adopcion[]): void {
    const ahora = new Date();
    const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
    const inicioAno = new Date(ahora.getFullYear(), 0, 1);
    
    this.estadisticasGenerales = {
      totalAnimales: {
        valor: animales.length,
        tendencia: 'stable',
        porcentajeCambio: 0
      },
      animalesDisponibles: {
        valor: animales.filter(a => a.disponibleAdopcion).length,
        tendencia: 'stable',
        porcentajeCambio: 0
      },
      animalesAdoptados: {
        valor: animales.filter(a => !a.disponibleAdopcion).length,
        tendencia: 'stable',
        porcentajeCambio: 0
      },
      adopcionesDelMes: {
        valor: adopciones.filter(a => 
          new Date(a.fechaAdopcion) >= inicioMes
        ).length,
        tendencia: 'stable',
        porcentajeCambio: 0
      },
      adopcionesDelAno: {
        valor: adopciones.filter(a =>
          new Date(a.fechaAdopcion) >= inicioAno
        ).length,
        tendencia: 'stable',
        porcentajeCambio: 0
      },
      tasaAdopcion: {
        valor: (adopciones.length / (animales.length || 1)) * 100,
        tendencia: 'stable',
        porcentajeCambio: 0
      },
      animalesCriticos: {
        valor: animales.filter(a => a.estadoSalud === 'CRITICO').length,
        tendencia: 'stable',
        porcentajeCambio: 0
      },
      animalesEnTratamiento: {
        valor: animales.filter(a => a.estadoSalud === 'EN_TRATAMIENTO').length,
        tendencia: 'stable',
        porcentajeCambio: 0
      }
    };
  }
  
  private procesarEstadisticasPorEspecie(animales: Animal[]): void {
    const especiesMap = new Map<string, { total: number; disponibles: number; adoptados: number }>();
    
    // Contar animales por especie
    animales.forEach(animal => {
      const especie = animal.especie;
      if (!especiesMap.has(especie)) {
        especiesMap.set(especie, { total: 0, disponibles: 0, adoptados: 0 });
      }
      
      const stats = especiesMap.get(especie)!;
      stats.total++;
      
      if (animal.disponibleAdopcion) {
        stats.disponibles++;
      } else {
        stats.adoptados++;
      }
    });
    
    // Convertir a array y calcular porcentajes
    this.estadisticasPorEspecie = Array.from(especiesMap.entries()).map(([especie, stats]) => ({
      especie,
      total: stats.total,
      disponibles: stats.disponibles,
      adoptados: stats.adoptados,
      porcentaje: (stats.total / animales.length) * 100
    })).sort((a, b) => b.total - a.total);
  }
  
  private procesarEstadisticasPorMes(adopciones: Adopcion[]): void {
    const mesesMap = new Map<string, { adopciones: number; ingresos: number }>();
    const meses = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    // Inicializar últimos 12 meses
    for (let i = 11; i >= 0; i--) {
      const fecha = new Date();
      fecha.setMonth(fecha.getMonth() - i);
      const key = `${meses[fecha.getMonth()]} ${fecha.getFullYear()}`;
      mesesMap.set(key, { adopciones: 0, ingresos: 0 });
    }

    // Contar adopciones por mes
    adopciones.forEach(adopcion => {
      const fecha = new Date(adopcion.fechaAdopcion);
      const key = `${meses[fecha.getMonth()]} ${fecha.getFullYear()}`;

      if (mesesMap.has(key)) {
        const stats = mesesMap.get(key)!;
        stats.adopciones++;
        // Quitar la línea de ingresos relacionados con donacion
        // stats.ingresos += adopcion.donacion || 0;
      }
    });

    this.estadisticasPorMes = Array.from(mesesMap.entries()).map(([mes, stats]) => ({
      mes,
      adopciones: stats.adopciones,
      ingresos: stats.ingresos // Puedes eliminar ingresos si ya no lo usas en la interfaz
    }));
  }
  
  private calcularTendencias(animales: Animal[], adopciones: Adopcion[]): void {
    const ahora = new Date();
    const mesAnterior = new Date(ahora.getFullYear(), ahora.getMonth() - 1, 1);
    const finMesAnterior = new Date(ahora.getFullYear(), ahora.getMonth(), 0);
    
    const adopcionesMesAnterior = adopciones.filter(a => {
      const fecha = new Date(a.fechaAdopcion);
      return fecha >= mesAnterior && fecha <= finMesAnterior;
    }).length;
    
    const adopcionesEsteMes = this.estadisticasGenerales.adopcionesDelMes.valor;
    const tasaAdopcionActual = (adopcionesEsteMes / this.estadisticasGenerales.totalAnimales.valor) * 100;
    const tasaAdopcionAnterior = (adopcionesMesAnterior / this.estadisticasGenerales.totalAnimales.valor) * 100;
    
    this.metricasTendencia = {
      totalAnimales: this.calcularTendencia(this.estadisticasGenerales.totalAnimales.valor, this.estadisticasGenerales.totalAnimales.valor),
      animalesDisponibles: this.calcularTendencia(this.estadisticasGenerales.animalesDisponibles.valor, this.estadisticasGenerales.animalesDisponibles.valor),
      animalesAdoptados: this.calcularTendencia(this.estadisticasGenerales.animalesAdoptados.valor, this.estadisticasGenerales.animalesAdoptados.valor),
      adopcionesDelMes: this.calcularTendencia(adopcionesEsteMes, adopcionesMesAnterior),
      adopcionesDelAno: this.calcularTendencia(this.estadisticasGenerales.adopcionesDelAno.valor, this.estadisticasGenerales.adopcionesDelAno.valor),
      tasaAdopcion: this.calcularTendencia(tasaAdopcionActual, tasaAdopcionAnterior),
      animalesCriticos: this.calcularTendencia(this.estadisticasGenerales.animalesCriticos.valor, this.estadisticasGenerales.animalesCriticos.valor),
      animalesEnTratamiento: this.calcularTendencia(this.estadisticasGenerales.animalesEnTratamiento.valor, this.estadisticasGenerales.animalesEnTratamiento.valor)
    };
  }
  
  private calcularTendencia(valorActual: number, valorAnterior: number): MetricaTendencia {
    if (valorAnterior === 0) {
      return { valor: valorActual, tendencia: 'stable', porcentajeCambio: 0 };
    }
    
    const porcentajeCambio = ((valorActual - valorAnterior) / valorAnterior) * 100;
    let tendencia: 'up' | 'down' | 'stable' = 'stable';
    
    if (Math.abs(porcentajeCambio) > 5) {
      tendencia = porcentajeCambio > 0 ? 'up' : 'down';
    }
    
    return {
      valor: valorActual,
      tendencia,
      porcentajeCambio: Math.abs(porcentajeCambio)
    };
  }
  
  private prepararDatosGraficos(): void {
    // Datos para gráfico de especies
    this.chartDataEspecies = this.estadisticasPorEspecie.map(esp => ({
      name: esp.especie,
      value: esp.total,
      disponibles: esp.disponibles,
      adoptados: esp.adoptados
    }));
    
    // Datos para gráfico de adopciones por mes
    this.chartDataAdopciones = this.estadisticasPorMes.map(mes => ({
      name: mes.mes,
      adopciones: mes.adopciones,
      ingresos: mes.ingresos
    }));
    
    // Datos para gráfico de estado de salud
    
  }
  
  // Métodos públicos para interacciones
  
  refreshData(): void {
    this.cargarEstadisticas();
  }
  
  toggleAutoRefresh(): void {
    this.autoRefresh = !this.autoRefresh;
    if (this.autoRefresh) {
      this.configurarAutoRefresh();
    }
  }
  
  cambiarPeriodo(fechaInicio: Date, fechaFin: Date): void {
    this.fechaInicio = fechaInicio;
    this.fechaFin = fechaFin;
    this.cargarEstadisticas();
  }
  
  
  
  exportarEstadisticas(): void {
    const datos = {
      fecha: new Date().toISOString(),
      estadisticasGenerales: this.estadisticasGenerales,
      estadisticasPorEspecie: this.estadisticasPorEspecie,
      estadisticasPorMes: this.estadisticasPorMes
    };
    
    const blob = new Blob([JSON.stringify(datos, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `estadisticas-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  // Métodos auxiliares para el template
  
  obtenerIconoTendencia(tendencia: string): string {
    switch (tendencia) {
      case 'up': return 'trending_up';
      case 'down': return 'trending_down';
      default: return 'trending_flat';
    }
  }
  
  obtenerColorTendencia(tendencia: string): string {
    switch (tendencia) {
      case 'up': return 'success';
      case 'down': return 'warning';
      default: return 'primary';
    }
  }
  
  formatearNumero(numero: number): string {
    return new Intl.NumberFormat('es-MX').format(numero);
  }
  
  formatearPorcentaje(numero: number): string {
    return `${numero.toFixed(1)}%`;
  }
  
  formatearMoneda(monto: number): string {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(monto);
  }

  // Ejemplo de método para mostrar cómo extraer el arreglo real de animales
  cargarDatosEjemplo(): void {
    this.animalService.obtenerAnimales().subscribe({
      next: (animalesResponse: AnimalResponse) => {
        const animales: Animal[] = animalesResponse.content;

        // Aquí deberías obtener las adopciones reales, este es solo un ejemplo
        this.adopcionService.obtenerAdopciones().subscribe({
          next: (adopcionesResponse) => {
            const adopciones: Adopcion[] = adopcionesResponse.content;

            // Usa el arreglo en tus funciones que esperan Animal[]
            this.procesarEstadisticasGenerales(animales, adopciones);
            this.procesarEstadisticasPorEspecie(animales);
            this.calcularTendencias(animales, adopciones);
          },
          error: (err) => {
            console.error('Error al obtener adopciones', err);
          }
        });
      },
      error: (err) => {
        console.error('Error al obtener animales', err);
      }
    });
  }

  confirmarExport() {
    this.exportando = true;
    // lógica para exportar
    setTimeout(() => this.exportando = false, 2000);
  }

  dismissAlerta(id: number) {
    // lógica para cerrar o eliminar la alerta con id dado
    console.log('Alerta cerrada:', id);
  }

  // Métodos adicionales solicitados
  obtenerClaseTasaAdopcion(tasa: number): string {
    if (tasa > 0.8) return 'alta';
    if (tasa > 0.5) return 'media';
    return 'baja';
  }

  obtenerIconoTasaAdopcion(tasa: number): string {
    if (tasa > 0.8) return 'thumb_up';
    if (tasa > 0.5) return 'thumbs_up_down';
    return 'thumb_down';
  }

  verDetallesEspecie(especie: string): void {
    // lógica para mostrar detalles de la especie
    console.log('Detalles de especie:', especie);
  }

  generarReporteEspecie(especie: string): void {
    // lógica para generar reporte
    console.log('Generar reporte para especie:', especie);
  }

  formatearFecha(fecha: Date): string {
    // lógica para formatear fecha
    return fecha.toLocaleDateString();
  }

  obtenerIconoAlerta(tipo: string): string {
    // lógica para icono según tipo de alerta
    switch (tipo) {
      case 'info': return 'info';
      case 'warning': return 'warning';
      case 'error': return 'error';
      default: return 'notification_important';
    }
  }

  formatearFechaHora(fecha: Date): string {
    // lógica para formatear fecha y hora
    return fecha.toLocaleString();
  }

  // Define aquí las demás propiedades y métodos que uses en el template
}