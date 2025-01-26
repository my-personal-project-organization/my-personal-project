/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  effect,
  ElementRef,
  forwardRef,
  HostListener,
  inject,
  input,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';

@Component({
  selector: 'ui-dropdown',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './dropdown.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DropdownComponent),
      multi: true,
    },
  ],
})
export class DropdownComponent implements ControlValueAccessor {
  // * Injectors
  private cd = inject(ChangeDetectorRef);
  private elRef = inject(ElementRef);

  // * Inputs & Outputs
  /**
   * List of options to display in the dropdown
   */
  public options = input<string[]>([]);
  /**
   * Placeholder text for the dropdown
   */
  public placeholder = input<string>('Select an option');
  /**
   * Event emitted when the selected option changes
   */
  public selectionChange = output<string>();

  // * Signals
  public optionSelected: string | null = null;
  // * Variables
  isOpen = false;
  // * ControlValueAccessor functions
  onChange = (value: unknown): void => {};
  onTouched = () => {};

  // *************
  // * EVENTS
  // *************

  /**
   * Handles click events outside of the dropdown component.
   * If a click occurs outside, it closes the dropdown.
   * @param event - The click event object.
   */
  @HostListener('document:click', ['$event'])
  clickout(event: Event) {
    if (!this.elRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
      this.cd.markForCheck(); // Ensure Angular updates the view
    }
  }

  /**
   * Toggles the open/closed state of the dropdown.
   */
  onCLickToggleDropdown() {
    this.isOpen = !this.isOpen;
    this.onTouched();
  }

  /**
   * Handles the selection of an option from the dropdown.
   * Updates the selected option, emits the selection change event,
   * and closes the dropdown.
   * @param option - The selected option value.
   */
  onClickSelectOption(option: string) {
    this.optionSelected = option;
    this.onChange(this.optionSelected);
    this.onTouched();
    this.isOpen = false;
    this.cd.markForCheck();
    this.selectionChange.emit(option);
  }

  // * ControlValueAccessor implementation

  /**
   * Sets the value of the dropdown.
   * @param value - The value to set.
   */
  writeValue(value: string): void {
    this.optionSelected = value;
    this.onChange(this.optionSelected);
    this.onTouched();
    this.cd.markForCheck();
  }

  /**
   * Registers a function to call when the value of the dropdown changes.
   * @param fn - The function to register.
   */
  registerOnChange(fn: () => void): void {
    this.onChange = fn;
  }

  /**
   * Registers a function to call when the dropdown is touched.
   * @param fn - The function to register.
   */
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}
