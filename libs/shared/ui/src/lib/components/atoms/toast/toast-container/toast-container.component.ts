import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ToastComponent } from '../toast.component';
import { ToastService } from '../toast.service';
import { trigger, transition, style, animate } from '@angular/animations'; // Import animation functions

@Component({
  selector: 'ui-toast-container',
  standalone: true,
  imports: [ToastComponent], // Import the ToastComponent to render it
  templateUrl: './toast-container.component.html',
  styleUrls: ['./toast-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('toastAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(100%)' }), // Start invisible and below
        animate(
          '300ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' }), // Fade in and slide up
        ),
      ]),
      transition(':leave', [
        animate(
          '300ms ease-in',
          style({ opacity: 0, transform: 'translateY(50%)' }), // Fade out and slide down slightly
        ),
      ]),
    ]),
  ],
})
export class ToastContainerComponent {
  protected readonly toastService = inject(ToastService);

  // TrackBy function for @for loop optimization
  protected trackById(index: number, item: { id: string }): string {
    return item.id;
  }
}
