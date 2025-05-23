import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  ViewEncapsulation,
} from '@angular/core';
import { ButtonColor, ButtonSize, ButtonType } from './button.domain';
import { ButtonService } from './button.service';

@Component({
  selector: 'ui-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [ButtonService],
})
export class ButtonComponent {
  // * Inputs and Outputs
  /** Disable the button */
  public disabled = input<boolean>();
  /** The type of the button */
  public type = input.required<ButtonType>();
  /** The text of the button */
  public text = input<string>('');
  /** The size of the button */
  public size = input<ButtonSize>('medium');
  /** The color of the button */
  public color = input<ButtonColor>('primary');
  /** Event emitted when the button is clicked */
  public btnClick = output<void>();

  private buttonService = inject(ButtonService);

  readonly buttonClasses = computed(() => {
    return this.buttonService.setClasses(this.color(), this.size());
  });
}
