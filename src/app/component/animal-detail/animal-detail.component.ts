// src/app/components/animal-detail/animal-detail.component.ts
import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AnimalService } from '../../services/animal.service';
import { Animal } from '../../models/animal.model';

@Component({
  selector: 'app-animal-detail',
  standalone: true,
  templateUrl: './animal-detail.html',
  styleUrls: ['./animal-detail.css'],
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
  ]
})
export class AnimalDetailComponent implements OnInit {
  animal: Animal | null = null;
  loading = true;
  animalId: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private animalService: AnimalService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.animalId = +this.route.snapshot.paramMap.get('id')!;
  }

  ngOnInit(): void {
    this.cargarAnimal();
  }

  cargarAnimal(): void {
    this.loading = true;
    this.animalService.obtenerAnimalPorId(this.animalId).subscribe({
      next: (animal) => {
        this.animal = animal;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar animal:', error);
        this.mostrarError('Error al cargar la información del animal');
        this.loading = false;
        this.router.navigate(['/animales']);
      }
    });
  }

  editarAnimal(): void {
    this.router.navigate(['/animales/editar', this.animalId]);
  }

  eliminarAnimal(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: {
        title: 'Confirmar eliminación',
        message: `¿Estás seguro de que deseas eliminar a ${this.animal?.nombre}?`,
        confirmText: 'Eliminar',
        cancelText: 'Cancelar'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.animalService.eliminarAnimal(this.animalId).subscribe({
          next: () => {
            this.mostrarExito('Animal eliminado correctamente');
            this.router.navigate(['/animales']);
          },
          error: (error) => {
            console.error('Error al eliminar animal:', error);
            this.mostrarError('Error al eliminar el animal');
          }
        });
      }
    });
  }

  volver(): void {
    this.router.navigate(['/animales']);
  }

  getEstadoColor(estado: string): string {
    switch (estado) {
      case 'SALUDABLE':
        return 'primary';
      case 'EN_TRATAMIENTO':
        return 'accent';
      case 'CRITICO':
        return 'warn';
      default:
        return '';
    }
  }

getSexoIcon(sexo?: string): string {
  if (!sexo) return 'help_outline';
  return sexo === 'Macho' ? 'male' : 'female';
}


  formatearFecha(fecha: Date): string {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  private mostrarError(mensaje: string): void {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }

  private mostrarExito(mensaje: string): void {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }
}

// Componente de diálogo de confirmación
@Component({
  selector: 'app-confirm-dialog',
  template: `
    <h1 mat-dialog-title>{{ data.title }}</h1>
    <div mat-dialog-content>
      <p>{{ data.message }}</p>
    </div>
    <div mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">{{ data.cancelText }}</button>
      <button mat-button color="warn" (click)="onConfirm()" cdkFocusInitial>
        {{ data.confirmText }}
      </button>
    </div>
  `
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}