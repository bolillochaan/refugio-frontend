import { Routes } from '@angular/router';

import { HomeComponent } from './component/home/home.component';
import { AnimalesListComponent } from './component/animales-list/animales-list.component';
import { AnimalFormComponent } from './component/animal-form/animal-form.component';
import { AnimalDetailComponent } from './component/animal-detail/animal-detail.component';
import { EstadisticasComponent } from './component/estadisticas/estadisticas.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'animales', component: AnimalesListComponent },
  { path: 'animales/crear', component: AnimalFormComponent },
  { path: 'animales/editar/:id', component: AnimalFormComponent },
  { path: 'detalle/:id', component: AnimalDetailComponent },
  { path: 'estadisticas', component: EstadisticasComponent },
  { path: '**', redirectTo: '' }
];
