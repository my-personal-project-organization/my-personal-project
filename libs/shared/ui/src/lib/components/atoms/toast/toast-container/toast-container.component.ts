import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ToastComponent } from '../toast.component';
import { ToastService } from '../toast.service';

@Component({
  selector: 'ui-toast-container',
  standalone: true,
  imports: [ToastComponent], // Import the ToastComponent to render it
  templateUrl: './toast-container.component.html',
  styleUrls: ['./toast-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastContainerComponent {
  protected readonly toastService = inject(ToastService);

  // TrackBy function for @for loop optimization
  protected trackById(index: number, item: { id: string }): string {
    return item.id;
  }
}
