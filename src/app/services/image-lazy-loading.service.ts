import { Injectable } from '@angular/core';
import { Observable, fromEvent, of, from } from 'rxjs';
import { map, filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ImageLazyLoadingService {

  constructor() { }

  /**
   * Observa cuando una imagen entra en el viewport
   */
  observeImageVisibility(imageElement: HTMLImageElement): Observable<boolean> {
    return new Observable(observer => {
      const intersectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              observer.next(true);
              observer.complete();
              intersectionObserver.disconnect();
            }
          });
        },
        {
          rootMargin: '50px 0px', // Precarga 50px antes de que la imagen sea visible
          threshold: 0.1
        }
      );

      intersectionObserver.observe(imageElement);

      return () => {
        intersectionObserver.disconnect();
      };
    });
  }

  /**
   * Carga una imagen de forma lazy
   */
  loadImage(imageUrl: string): Observable<string> {
    return new Observable(observer => {
      const img = new Image();
      
      img.onload = () => {
        observer.next(imageUrl);
        observer.complete();
      };
      
      img.onerror = (error) => {
        observer.error(error);
      };
      
      img.src = imageUrl;
    });
  }

  /**
   * Precarga imágenes importantes
   */
  preloadImages(imageUrls: string[]): Observable<string[]> {
    const loadPromises = imageUrls.map(url => 
      this.loadImage(url).toPromise()
    );
    
    return from(Promise.all(loadPromises)).pipe(
      map(results => results.filter((result): result is string => result !== undefined))
    );
  }

  /**
   * Optimiza la carga de imágenes de animales
   */
  optimizeAnimalImages(animalImages: string[]): Observable<string[]> {
    // Prioriza las primeras imágenes y carga el resto de forma lazy
    const priorityImages = animalImages.slice(0, 3);
    const lazyImages = animalImages.slice(3);
    
    // Carga inmediata de imágenes prioritarias
    this.preloadImages(priorityImages).subscribe();
    
    // Retorna todas las URLs para lazy loading
    return of(animalImages);
  }
} 