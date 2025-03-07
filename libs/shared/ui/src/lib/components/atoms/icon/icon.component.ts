import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  inject,
  input,
  Renderer2,
} from '@angular/core';
import { IconService } from './icon.service';
import { IconName, IconSize } from './icons.types';

@Component({
  selector: 'ui-icon',
  standalone: true,
  imports: [CommonModule],
  template: '',
  styleUrls: ['./icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconComponent {
  // * Inputs and Outputs
  /** The icon to render from the list */
  name = input.required<IconName>();
  /** The size of the icon */
  size = input<IconSize>(24);

  private el = inject(ElementRef);
  private renderer = inject(Renderer2);
  private iconService = inject(IconService);

  constructor() {
    effect(() => {
      this.updateIcon(this.name(), this.size());
    });
  }

  private updateIcon(name: IconName, size: IconSize): void {
    const svgString = this.iconService.getIcon(name);
    if (svgString) {
      this.el.nativeElement.innerHTML = '';
      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(svgString, 'image/svg+xml');
      const svgElement = svgDoc.documentElement;

      if (typeof size === 'number') {
        this.renderer.setAttribute(svgElement, 'width', `${size}px`);
        this.renderer.setAttribute(svgElement, 'height', `${size}px`);
      } else {
        this.renderer.setStyle(svgElement, 'width', size);
        this.renderer.setStyle(svgElement, 'height', size);
      }
      this.renderer.addClass(svgElement, 'text-gray-600');
      this.renderer.addClass(svgElement, 'dark:text-gray-300');
      this.renderer.appendChild(this.el.nativeElement, svgElement);
    } else {
      console.warn(`Icon "${name}" not found in registry.`);
      this.el.nativeElement.innerHTML = `NoIcon ${name}`;
    }
  }
}
