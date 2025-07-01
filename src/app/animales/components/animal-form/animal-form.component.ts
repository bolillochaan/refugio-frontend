// src/app/components/animal-form/animal-form.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AnimalService } from '../../../services/animal.service';
import { Animal } from '../../../models/animal.model';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../components/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-animal-form',
  templateUrl: './animal-form.component.html',
  styleUrls: ['./animal-form.component.css'],
  standalone: true,
  imports: [
     ReactiveFormsModule,
     MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
    CommonModule,
    MatProgressSpinnerModule
  ]
})
export class AnimalFormComponent implements OnInit {
  animalForm: FormGroup;
  isEditMode = false;
  animalId: number | null = null;
  loading = false;

  especies = [
    'Perro', 'Gato', 'Conejo', 'Hamster', 'Cobayo', 'Pájaro', 'Reptil', 'Pez', 'Otro'
  ];

  estadosSalud = [
    { value: 'SALUDABLE', label: 'Saludable' },
    { value: 'EN_TRATAMIENTO', label: 'En Tratamiento' },
    { value: 'CRITICO', label: 'Crítico' }
  ];


  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private animalService: AnimalService,
    private snackBar: MatSnackBar
  ) {
    this.animalForm = this.createForm();
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.animalId = +id;
      this.cargarAnimal();
    }
  }

  createForm(): FormGroup {
    return this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      especie: ['', Validators.required],
      raza: ['', Validators.required],
      
      estadoSalud: ['SALUDABLE', Validators.required],
      descripcion: [''],
      historialMedico: [''],
      disponibleAdopcion: [true],
      fotoUrl: [''],
      fechaIngreso: [new Date().toISOString()] // <-- Agrega esto
    });
  }

cargarAnimal(): void {
  if (!this.animalId) return;

  this.loading = true;
  this.animalService.obtenerAnimalPorId(this.animalId).subscribe({
    next: (animal) => {
      this.animalForm.patchValue({
        nombre: animal.nombre,
        especie: animal.especie,
        raza: animal.raza,
        edadAproximada: animal.edadAproximada,
        peso: animal.peso,
        color: animal.color, // <-- Añade este campo
        estadoSalud: animal.estadoSalud,
        descripcion: animal.descripcion,
        fechaIngreso: animal.fechaIngreso,
        disponibleAdopcion: animal.disponibleAdopcion,
        fotoUrl: animal.fotoUrl
      });
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

onSubmit(): void {
  if (this.animalForm.invalid) {
    this.marcarCamposComoTocados();
    this.mostrarError('Por favor, completa todos los campos requeridos');
    return;
  }

  this.loading = true;
  const animalData: Animal = this.animalForm.value;

  const operacion = this.isEditMode 
    ? this.animalService.actualizarAnimal(this.animalId!, animalData)
    : this.animalService.crearAnimal(animalData);

  operacion.subscribe({
    next: (response) => {
      const mensaje = this.isEditMode 
        ? 'Animal actualizado exitosamente'
        : 'Animal registrado exitosamente';
      
      this.mostrarExito(mensaje);
      
      // Enviar correo después de guardar
      this.enviarCorreoNotificacion(response, this.isEditMode ? 'actualización' : 'registro');
      
      this.loading = false;
      this.router.navigate(['/animales']);
    },
    error: (error) => {
      console.error('Error al guardar animal:', error);
      const mensaje = this.isEditMode 
        ? 'Error al actualizar el animal'
        : 'Error al registrar el animal';
      
      this.mostrarError(mensaje);
      this.loading = false;
    }
  });
}

  onCancel(): void {
    if (this.animalForm.dirty) {
      const confirmacion = confirm('¿Estás seguro de que quieres cancelar? Se perderán los cambios no guardados.');
      if (!confirmacion) {
        return;
      }
    }
    this.router.navigate(['/animales']);
  }

  marcarCamposComoTocados(): void {
    Object.keys(this.animalForm.controls).forEach(key => {
      const control = this.animalForm.get(key);
      control?.markAsTouched();
    });
  }

  enviarCorreoNotificacion(animal: Animal, tipoAccion: string): void {
  const asunto = `Notificación de ${tipoAccion} de animal`;
  const cuerpo = `Se ha ${tipoAccion} el animal ${animal.nombre} (${animal.especie}).\n\n` +
                 `Detalles:\n` +
                 `- Nombre: ${animal.nombre}\n` +
                 `- Especie: ${animal.especie}\n` +
                 `- Raza: ${animal.raza}\n` +
                 `- Estado de salud: ${animal.estadoSalud}\n` +
                 `- Fecha de ingreso: ${animal.fechaIngreso}\n\n` +
                 `Por favor revise el sistema para más detalles.`;

  const datosCorreo = {
    asunto: asunto,
    cuerpo: cuerpo,
    destinatarios: ['admin@refugio.com', 'personal@refugio.com'], // Ajusta los destinatarios
    animalId: animal.id
  };

  this.animalService.enviarCorreoNotificacion(datosCorreo).subscribe({
    next: () => {
      console.log('Correo de notificación enviado exitosamente');
    },
    error: (error) => {
      console.error('Error al enviar correo de notificación:', error);
      // No mostramos error al usuario para no confundirlo con el éxito de guardar
    }
  });
}

  isFieldInvalid(fieldName: string): boolean {
    const field = this.animalForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.animalForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) {
        return `${this.getFieldLabel(fieldName)} es requerido`;
      }
      if (field.errors['minlength']) {
        return `${this.getFieldLabel(fieldName)} debe tener al menos ${field.errors['minlength'].requiredLength} caracteres`;
      }
      if (field.errors['min']) {
        return `${this.getFieldLabel(fieldName)} debe ser mayor a ${field.errors['min'].min}`;
      }
      if (field.errors['max']) {
        return `${this.getFieldLabel(fieldName)} debe ser menor a ${field.errors['max'].max}`;
      }
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      'nombre': 'El nombre',
      'especie': 'La especie',
      'raza': 'La raza',
      'edadAproximada': 'La edad',
      'peso': 'El peso',
      'color': 'El color',
      'estadoSalud': 'El estado de salud'
    };
    return labels[fieldName] || fieldName;
  }

  private mostrarExito(mensaje: string): void {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  private mostrarError(mensaje: string): void {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }
ocultarImagen(event: Event): void {
  const img = event.target as HTMLImageElement | null;
  if (img) {
    img.style.display = 'none';
  }
}
  // Método para manejar la subida de imágenes (opcional)
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Aquí puedes implementar la lógica para subir la imagen
      // Por ejemplo, usando un servicio de upload
      console.log('Archivo seleccionado:', file);
      
      // Ejemplo básico de preview de imagen
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.animalForm.patchValue({
          fotoUrl: e.target.result
        });
      };
      reader.readAsDataURL(file);
    }
  }

  actualizarEstado(nuevoEstado: string): void {
    if (!this.animalId) return;
    this.animalService.actualizarEstado(this.animalId, nuevoEstado).subscribe({
      next: () => {
        this.mostrarExito('Estado actualizado correctamente');
        // Recarga todos los datos del animal desde el backend
        this.cargarAnimal();
        // Si el nuevo estado es 'ADOPTADO', manda el correo
        if (nuevoEstado === 'ADOPTADO') {
          // Espera a que cargarAnimal termine para tener los datos actualizados
          setTimeout(() => {
            if (this.animalForm.value) {
              this.enviarCorreoAdopcion(this.animalForm.value);
            }
          }, 500);
        }
      },
      error: () => this.mostrarError('No se pudo actualizar el estado')
    });
  }

  enviarCorreoAdopcion(animal: Animal): void {
    this.animalService.enviarCorreoAdopcion(animal).subscribe({
      next: () => this.mostrarExito('Correo de adopción enviado al refugio'),
      error: () => this.mostrarError('No se pudo enviar el correo de adopción')
    });
  }

  

  // Método para confirmar eliminación
confirmarEliminacion(): void {
  const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    width: '350px',
    data: {
      title: 'Confirmar Eliminación',
      message: '¿Estás seguro de que quieres eliminar este animal? Esta acción no se puede deshacer.',
      confirmText: 'Eliminar',
      cancelText: 'Cancelar'
    }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.eliminarAnimal();
    }
  });
}

// Método para eliminar el animal
eliminarAnimal(): void {
  if (!this.animalId) return;

  this.loading = true;
  this.animalService.eliminarAnimal(this.animalId).subscribe({
    next: () => {
      this.mostrarExito('Animal eliminado exitosamente');
      this.router.navigate(['/animales']);
    },
    error: (error) => {
      console.error('Error al eliminar animal:', error);
      this.mostrarError('Error al eliminar el animal');
      this.loading = false;
    }
  });
}


}