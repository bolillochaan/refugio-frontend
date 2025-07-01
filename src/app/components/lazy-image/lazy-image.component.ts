import { Component, Input, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ImageLazyLoadingService } from '../../services/image-lazy-loading.service';

@Component({
  selector: 'app-lazy-image',
  standalone: true,
  imports: [CommonModule],
  template: `
    <img 
      [src]="imageSrc" 
      [alt]="alt"
      [class]="cssClass"
      [style]="imageStyle"
      (load)="onImageLoad()"
      (error)="onImageError()"
      [class.loading]="isLoading"
      [class.error]="hasError"
      [class.loaded]="isLoaded"
    />
    <div *ngIf="isLoading" class="loading-placeholder">
      <div class="spinner"></div>
    </div>
    <div *ngIf="hasError" class="error-placeholder">
      <span>Error al cargar imagen</span>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      position: relative;
    }
    
    img {
      width: 100%;
      height: auto;
      transition: opacity 0.3s ease;
    }
    
    img.loading {
      opacity: 0;
    }
    
    img.loaded {
      opacity: 1;
    }
    
    .loading-placeholder {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #f5f5f5;
    }
    
    .spinner {
      width: 20px;
      height: 20px;
      border: 2px solid #ddd;
      border-top: 2px solid #007bff;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    .error-placeholder {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #f8d7da;
      color: #721c24;
      font-size: 12px;
    }
  `]
})
export class LazyImageComponent implements OnInit, OnDestroy {
  @Input() src: string = '';
  @Input() alt: string = '';
  @Input() cssClass: string = '';
  @Input() imageStyle: string = '';
  @Input() placeholder: string = 'assets/placeholder-animal.jpg';

  imageSrc: string = '';
  isLoading: boolean = true;
  isLoaded: boolean = false;
  hasError: boolean = false;
  private subscription: Subscription = new Subscription();

  constructor(
    private elementRef: ElementRef,
    private imageLazyLoadingService: ImageLazyLoadingService
  ) {}

  ngOnInit(): void {
    this.imageSrc = this.placeholder;
    this.setupLazyLoading();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private setupLazyLoading(): void {
    const imgElement = this.elementRef.nativeElement.querySelector('img');
    if (imgElement) {
      this.subscription.add(
        this.imageLazyLoadingService.observeImageVisibility(imgElement)
          .subscribe(() => {
            this.loadActualImage();
          })
      );
    }
  }

  private loadActualImage(): void {
    if (this.src) {
      this.subscription.add(
        this.imageLazyLoadingService.loadImage(this.src)
          .subscribe({
            next: (url) => {
              this.imageSrc = url;
              this.isLoading = false;
              this.isLoaded = true;
            },
            error: () => {
              this.hasError = true;
              this.isLoading = false;
            }
          })
      );
    }
  }

  onImageLoad(): void {
    this.isLoading = false;
    this.isLoaded = true;
    this.hasError = false;
  }

  onImageError(): void {
    this.hasError = true;
    this.isLoading = false;
    this.isLoaded = false;
  }
} 