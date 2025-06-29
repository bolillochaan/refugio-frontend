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
import { AnimalesListComponent } from './component/animales-list/animales-list';
import { AnimalDetailComponent } from './component/animal-detail/animal-detail.component';
import { AnimalFormComponent } from './component/animal-form/animal-form';
import { EstadisticasComponent } from './component/estadisticas/estadisticas.component';
// Si tienes NavbarComponent standalone, impórtalo aquí también

@NgModule({
  declarations: [
    AnimalDetailComponent,
    // otros componentes NO standalone aquí
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    RouterModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,      // <-- agregado aquí
    MatCardModule,      // <-- agregado aquí
    MatProgressSpinnerModule,
    MatToolbarModule,
    MatButtonModule,
    MatSelectModule,
    MatChipsModule,
    MatPaginatorModule,
    MatSnackBarModule,
    MatDialogModule,
    MatTableModule,
    MatSortModule,

    // Standalone components
    AppComponent,
    HomeComponent,
    AnimalesListComponent,
    AnimalFormComponent,
    EstadisticasComponent
    // NavbarComponent, // si es standalone
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }