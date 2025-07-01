import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MaterialModule } from '../../shared/material.module';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule
  ],
  templateUrl: './navbar-component.html',
  styleUrls: ['./navbar-component.css']
})
export class NavbarComponent {}