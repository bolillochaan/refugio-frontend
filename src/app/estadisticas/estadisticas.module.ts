import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EstadisticasComponent } from './estadisticas/estadisticas.component';
import { EstadisticasRoutingModule } from './estadisticas-routing.module';

// Lazy loading de servicios específicos del módulo
import { AnimalService } from '../services/animal.service';
import { AdopcionService } from '../services/adopcion.service';

@NgModule({
  declarations: [
   
  ],
  imports: [
    CommonModule,
    EstadisticasRoutingModule,
     EstadisticasComponent
    // Aquí puedes agregar otros módulos específicos para estadísticas
    // como ChartsModule, etc.
  ],
  providers: [
    // Servicios específicos del módulo de estadísticas
    AnimalService,
    AdopcionService
  ]
})
export class EstadisticasModule { }