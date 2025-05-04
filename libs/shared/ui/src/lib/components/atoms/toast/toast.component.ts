import {
  Component,
  OnInit,
  OnDestroy,
  input,
  output,
  ChangeDetectionStrategy,
  inject,
  ChangeDetectorRef,
  computed,
} from '@angular/core';
import { NgClass } from '@angular/common';

// Define allowed toast types using 'as const'
export const ToastTypes = ['info', 'success', 'warning', 'error'] as const;
export type ToastType = (typeof ToastTypes)[number];

@Component({
  selector: 'ui-toast',
  standalone: true,
  imports: [NgClass],
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastComponent implements OnInit, OnDestroy {
  // * Inputs
  /** Unique identifier for the toast instance */
  public id = input.required<string>();
  /** The main message content of the toast */
  public message = input.required<string>();
  /** Optional title for the toast */
  public title = input<string>();
  /** Type of the toast, determines styling */
  public type = input<ToastType>('info');
  /** Duration in seconds before auto-dismiss (0 = no auto-dismiss) */
  public duration = input<number>(5); // Default 5 seconds

  // * Outputs
  /** Emitted when the toast is closed (manually or automatically), passing the toast ID */
  public closed = output<string>(); // Emit string (the ID)

  // * Private
  private _timeoutId: ReturnType<typeof setTimeout> | null = null; // Store timeout ID

  // * Computed styles based on type
  protected toastClasses = computed(() => {
    const baseClasses = 'relative w-full max-w-sm rounded-md border p-4 shadow-lg'; // Removed mb-4, container handles spacing
    const typeClasses = {
      info: 'bg-blue-100 border-blue-300 text-blue-800 dark:bg-blue-900 dark:border-blue-700 dark:text-blue-200',
      success:
        'bg-green-100 border-green-300 text-green-800 dark:bg-green-900 dark:border-green-700 dark:text-green-200',
      warning:
        'bg-yellow-100 border-yellow-300 text-yellow-800 dark:bg-yellow-900 dark:border-yellow-700 dark:text-yellow-200',
      error: 'bg-red-100 border-red-300 text-red-800 dark:bg-red-900 dark:border-red-700 dark:text-red-200',
    };
    return `${baseClasses} ${typeClasses[this.type()]}`;
  });

  protected titleClasses = computed(() => {
    const baseClasses = 'font-semibold block mb-1';
    const typeClasses = {
      info: 'text-blue-900 dark:text-blue-100',
      success: 'text-green-900 dark:text-green-100',
      warning: 'text-yellow-900 dark:text-yellow-100',
      error: 'text-red-900 dark:text-red-100',
    };
    return `${baseClasses} ${typeClasses[this.type()]}`;
  });

  ngOnInit(): void {
    this._setupAutoClose();
  }

  ngOnDestroy(): void {
    this._clearTimeout();
  }

  /** Manually close the toast */
  public close(): void {
    this._clearTimeout(); // Clear timeout if closed manually
    this.closed.emit(this.id()); // Emit the ID when closed
  }

  private _setupAutoClose(): void {
    const durationSeconds = this.duration();
    if (durationSeconds > 0) {
      this._timeoutId = setTimeout(() => {
        this.close();
      }, durationSeconds * 1000);
    }
  }

  private _clearTimeout(): void {
    if (this._timeoutId) {
      clearTimeout(this._timeoutId);
      this._timeoutId = null;
    }
  }
}
