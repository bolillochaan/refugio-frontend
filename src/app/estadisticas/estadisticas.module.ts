import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EstadisticasComponent } from './estadisticas/estadisticas.component';
import { EstadisticasRoutingModule } from './estadisticas-routing.module';

@NgModule({
  declarations: [
   
  ],
  imports: [
    CommonModule,
    EstadisticasRoutingModule,
     EstadisticasComponent
    // Aquí puedes agregar otros módulos específicos para estadísticas
    // como ChartsModule, etc.
  ]
})
export class EstadisticasModule { }