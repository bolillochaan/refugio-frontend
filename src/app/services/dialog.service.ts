import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { LazyLoadingService } from './lazy-loading.service';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(
    private dialog: MatDialog,
    private lazyLoadingService: LazyLoadingService
  ) { }

  /**
   * Abre un diálogo de confirmación con lazy loading
   */
  openConfirmDialog(data: {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
  }): Observable<boolean> {
    return new Observable(observer => {
      this.lazyLoadingService.loadModalComponent('./components/confirm-dialog/confirm-dialog')
        .subscribe(component => {
          const dialogRef = this.dialog.open(component, {
            width: '400px',
            data: data,
            disableClose: true
          });

          dialogRef.afterClosed().subscribe(result => {
            observer.next(result);
            observer.complete();
          });
        });
    });
  }

  /**
   * Abre un diálogo personalizado con lazy loading
   */
  openCustomDialog(componentPath: string, config: any = {}): Observable<any> {
    return new Observable(observer => {
      this.lazyLoadingService.loadModalComponent(componentPath)
        .subscribe(component => {
          const dialogRef = this.dialog.open(component, {
            width: config.width || '500px',
            data: config.data || {},
            disableClose: config.disableClose || false,
            ...config
          });

          dialogRef.afterClosed().subscribe(result => {
            observer.next(result);
            observer.complete();
          });
        });
    });
  }
} 