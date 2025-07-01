import { Routes } from '@angular/router';

import { HomeComponent } from './component/home/home.component';
import { AnimalesListComponent } from './animales/components/animales-list/animales-list.component';
import { AnimalFormComponent } from './animales/components/animal-form/animal-form.component';
import { AnimalDetailComponent } from './animales/components/animal-detail/animal-detail.component';
import { EstadisticasComponent } from './estadisticas/estadisticas/estadisticas.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'animales', component: AnimalesListComponent },
  { path: 'animales/crear', component: AnimalFormComponent },
  { path: 'animales/editar/:id', component: AnimalFormComponent },
  { path: 'detalle/:id', component: AnimalDetailComponent },
  { path: 'estadisticas', component: EstadisticasComponent },
  { path: '**', redirectTo: '' }
];
