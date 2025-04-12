import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, TemplateRef } from '@angular/core';

@Component({
  selector: 'ui-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss'],
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideBarComponent {
  isOpen = input(false);
  sidebarContent = input<TemplateRef<any> | null>(null);
}
