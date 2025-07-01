// app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common'; // <-- Agrega esto si no está
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';


// Angular Material Modules
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';

import { AppRoutingModule } from './app-routing.module';

// Standalone components
import { AppComponent } from './app.component';
import { HomeComponent } from './component/home/home.component';
import { AnimalesListComponent } from './animales/components/animales-list/animales-list.component';
import { AnimalDetailComponent } from './animales/components/animal-detail/animal-detail.component';
import { AnimalFormComponent } from './animales/components/animal-form/animal-form.component';
import { EstadisticasComponent } from './estadisticas/estadisticas/estadisticas.component';
// Si tienes NavbarComponent standalone, impórtalo aquí también

// Este archivo ya no es necesario porque migraste a standalone bootstrap con bootstrapApplication.
// Puedes eliminar este archivo o dejarlo vacío si no tienes otros NgModules.