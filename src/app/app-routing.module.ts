// app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
import { AnimalesListComponent } from './component/animales-list/animales-list';
import { AnimalDetailComponent } from './component/animal-detail/animal-detail.component';
import { AnimalFormComponent } from './component/animal-form/animal-form';
import { EstadisticasComponent } from './component/estadisticas/estadisticas.component';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'animales', component: AnimalesListComponent },
  { path: 'animales/crear', component: AnimalFormComponent },
  { path: 'animales/editar/:id', component: AnimalFormComponent },
  { path: 'animales/:id', component: AnimalDetailComponent },
  { path: 'estadisticas', component: EstadisticasComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }