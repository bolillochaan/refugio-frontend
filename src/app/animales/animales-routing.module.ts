import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnimalesListComponent } from './components/animales-list/animales-list.component';
import { AnimalDetailComponent } from './components/animal-detail/animal-detail.component';
import { AnimalFormComponent } from './components/animal-form/animal-form.component';

const routes: Routes = [
  { path: '', component: AnimalesListComponent },
  { path: 'crear', component: AnimalFormComponent },
  { path: 'editar/:id', component: AnimalFormComponent },
  { path: 'detalle/:id', component: AnimalDetailComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnimalesRoutingModule { }