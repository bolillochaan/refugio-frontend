import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';

import { HomeRoutingModule } from './../home/home.routing-module';

@NgModule({
  declarations: [
    
  ],
  imports: [
    CommonModule,
    HomeComponent,
    HomeRoutingModule
    // Otros módulos que solo necesite el Home
  ]
})
export class HomeModule { }