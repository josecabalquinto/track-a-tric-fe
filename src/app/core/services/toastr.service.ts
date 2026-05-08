import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type ToastrType = 'success' | 'info' | 'warning' | 'error';

export interface ToastrOptions {
  closeButton: boolean;
  debug: boolean;
  newestOnTop: boolean;
  progressBar: boolean;
  positionClass: string;
  preventDuplicates: boolean;
  onclick: null | (() => void);
  showDuration: string;
  hideDuration: string;
  timeOut: string;
  extendedTimeOut: string;
  showEasing: string;
  hideEasing: string;
  showMethod: string;
  hideMethod: string;
}

export interface AppToast {
  id: number;
  type: ToastrType;
  title?: string;
  message: string;
  closing: boolean;
  options: ToastrOptions;
}

const DEFAULT_TOASTR_OPTIONS: ToastrOptions = {
  closeButton: false,
  debug: false,
  newestOnTop: true,
  progressBar: true,
  positionClass: 'toast-top-right',
  preventDuplicates: false,
  onclick: null,
  showDuration: '300',
  hideDuration: '1000',
  timeOut: '5000',
  extendedTimeOut: '1000',
  showEasing: 'swing',
  hideEasing: 'linear',
  showMethod: 'fadeIn',
  hideMethod: 'fadeOut',
};

@Injectable({
  providedIn: 'root',
})
export class ToastrService {
  private readonly toastsSubject = new BehaviorSubject<AppToast[]>([]);
  private nextId = 1;

  readonly toasts$: Observable<AppToast[]> = this.toastsSubject.asObservable();
  readonly options: ToastrOptions = DEFAULT_TOASTR_OPTIONS;

  success(message: string, title = 'Success', options?: Partial<ToastrOptions>): void {
    this.show('success', message, title, options);
  }

  info(message: string, title = 'Info', options?: Partial<ToastrOptions>): void {
    this.show('info', message, title, options);
  }

  warning(message: string, title = 'Warning', options?: Partial<ToastrOptions>): void {
    this.show('warning', message, title, options);
  }

  error(message: string, title = 'Error', options?: Partial<ToastrOptions>): void {
    this.show('error', message, title, options);
  }

  dismiss(id: number): void {
    const current = this.toastsSubject.value;
    const toast = current.find((item) => item.id === id);

    if (!toast || toast.closing) {
      return;
    }

    this.toastsSubject.next(
      current.map((item) => (item.id === id ? { ...item, closing: true } : item))
    );

    window.setTimeout(() => {
      this.toastsSubject.next(
        this.toastsSubject.value.filter((item) => item.id !== id)
      );
    }, this.toNumber(toast.options.hideDuration, 1000));
  }

  triggerClick(toast: AppToast): void {
    toast.options.onclick?.();
  }

  private show(
    type: ToastrType,
    message: string,
    title?: string,
    overrideOptions?: Partial<ToastrOptions>
  ): void {
    const options = { ...DEFAULT_TOASTR_OPTIONS, ...overrideOptions };
    const toast: AppToast = {
      id: this.nextId++,
      type,
      title,
      message,
      closing: false,
      options,
    };

    const updatedToasts = options.newestOnTop
      ? [toast, ...this.toastsSubject.value]
      : [...this.toastsSubject.value, toast];

    this.toastsSubject.next(updatedToasts);

    window.setTimeout(() => {
      this.dismiss(toast.id);
    }, this.toNumber(options.timeOut, 5000));
  }

  private toNumber(value: string, fallback: number): number {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }
}
