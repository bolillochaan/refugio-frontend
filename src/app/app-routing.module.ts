import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './component/home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { 
    path: 'animales', 
    loadChildren: () => import('./animales/animal.module').then(m => m.AnimalesModule) 
  },
  { 
    path: 'estadisticas', 
    loadChildren: () => import('./estadisticas/estadisticas.module').then(m => m.EstadisticasModule) 
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }