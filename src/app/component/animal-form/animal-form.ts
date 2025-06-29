// src/app/components/animal-form/animal-form.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AnimalService } from '../../services/animal.service';
import { Animal } from '../../models/animal.model';

@Component({
  selector: 'app-animal-form',
  templateUrl: './animal-form.component.html',
  styleUrls: ['./animal-form.component.css'],
  // standalone: true // solo si lo usas como standalone
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

  sexos = [
    { value: 'MACHO', label: 'Macho' },
    { value: 'HEMBRA', label: 'Hembra' }
  ];

  constructor(
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
      edadAproximada: [1, [Validators.required, Validators.min(0), Validators.max(30)]],
      peso: [1, [Validators.required, Validators.min(0.1), Validators.max(200)]],
      color: ['', Validators.required],
      sexo: ['', Validators.required],
      estadoSalud: ['SALUDABLE', Validators.required],
      descripcion: [''],
      historialMedico: [''],
      disponibleAdopcion: [true],
      fotoUrl: ['']
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
          color: animal.color,
          sexo: animal.sexo,
          estadoSalud: animal.estadoSalud,
          descripcion: animal.descripcion,
          historialMedico: animal.historialMedico,
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
      'sexo': 'El sexo',
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
}