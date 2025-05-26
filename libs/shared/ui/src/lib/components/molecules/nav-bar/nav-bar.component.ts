import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, signal, TemplateRef } from '@angular/core';
import { ButtonComponent, IconComponent } from '../../atoms';
import { SideBarComponent } from '../../atoms/side-bar/side-bar.component';

@Component({
  selector: 'ui-nav-bar',
  templateUrl: './nav-bar.component.html',
  imports: [CommonModule, ButtonComponent, IconComponent, SideBarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavBarComponent {
  sidebarContent = input<TemplateRef<any> | null>(null);

  isOpen = signal(false);

  open(): void {
    this.isOpen.set(true);
  }

  close(): void {
    this.isOpen.set(false);
  }

  toggle(): void {
    this.isOpen.update((value) => !value);
  }
}
