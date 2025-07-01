// animales.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AnimalesListComponent } from './components/animales-list/animales-list.component';
import { AnimalDetailComponent } from './components/animal-detail/animal-detail.component';
import { AnimalFormComponent } from './components/animal-form/animal-form.component';
import { AnimalesRoutingModule } from './animales-routing.module';

// Lazy loading de servicios específicos del módulo
import { AnimalService } from '../services/animal.service';
import { AdopcionService } from '../services/adopcion.service';

@NgModule({
  declarations: [
    
    // Eliminamos AnimalFormComponent de declarations
  ],
  imports: [
    CommonModule,
    AnimalesListComponent,
    AnimalDetailComponent,
    AnimalesRoutingModule,
    AnimalFormComponent // Importamos el componente standalone aquí
  ],
  providers: [
    // Servicios específicos del módulo de animales
    AnimalService,
    AdopcionService
  ]
})
export class AnimalesModule { }