// app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// Angular Material Modules
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';

import { AppRoutingModule } from './app-routing.module';

// Importa los componentes standalone
import { AppComponent } from './app.component';
import { HomeComponent } from './component/home/home.component';
import { AnimalesListComponent } from './component/animales-list/animales-list';
import { AnimalDetailComponent } from './component/animal-detail/animal-detail.component';
import { AnimalFormComponent } from './component/animal-form/animal-form';
import { EstadisticasComponent } from './component/estadisticas/estadisticas.component';

@NgModule({
  declarations: [
    // Solo los componentes NO standalone aquí
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,

    // Angular Material
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule,
    MatIconModule,
    MatTableModule,
    MatSortModule,

    // Standalone components van aquí
    AppComponent,
    HomeComponent,
    AnimalesListComponent,
    AnimalDetailComponent,
    AnimalFormComponent,
    EstadisticasComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }