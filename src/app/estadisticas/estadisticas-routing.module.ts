import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EstadisticasComponent } from './estadisticas/estadisticas.component';


const routes: Routes = [
  { path: '', component: EstadisticasComponent }
  // Puedes agregar más rutas hijas aquí si necesitas
  // { path: 'detalle', component: EstadisticasDetalleComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EstadisticasRoutingModule { }