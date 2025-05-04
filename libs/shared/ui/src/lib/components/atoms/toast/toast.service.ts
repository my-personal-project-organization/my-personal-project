import { computed, Injectable, signal } from '@angular/core';
import { ToastType } from './toast.component';

// Define the shape of the toast configuration object
export type ToastConfig = {
  readonly id: string;
  readonly message: string;
  readonly title?: string;
  readonly type: ToastType;
  readonly duration: number; // Duration in seconds (0 for sticky)
};

@Injectable({
  providedIn: 'root', // Singleton service
})
export class ToastService {
  // Private writable signal to hold the list of active toasts
  private readonly _toasts = signal<readonly ToastConfig[]>([]);

  // Public computed signal for components to react to
  public readonly toasts = computed(() => this._toasts());

  // Method to show a toast with specific configuration
  public show(config: Omit<ToastConfig, 'id'>): string {
    const id = this._generateId();
    const newToast: ToastConfig = { ...config, id };
    this._toasts.update((currentToasts) => [...currentToasts, newToast]);
    return id;
  }

  // Convenience methods for different toast types
  public info(message: string, title?: string, duration = 5): string {
    return this.show({ message, title, type: 'info', duration });
  }

  public success(message: string, title?: string, duration = 5): string {
    return this.show({ message, title, type: 'success', duration });
  }

  public warning(message: string, title?: string, duration = 5): string {
    return this.show({ message, title, type: 'warning', duration });
  }

  public error(message: string, title?: string, duration = 0): string {
    // Default error duration to 0 (sticky)
    return this.show({ message, title, type: 'error', duration });
  }

  // Method to remove a toast by its ID
  public remove(id: string): void {
    this._toasts.update((currentToasts) => currentToasts.filter((toast) => toast.id !== id));
  }

  // Helper to generate unique IDs
  private _generateId(): string {
    return Math.random().toString(36).substring(2, 9);
  }
}
