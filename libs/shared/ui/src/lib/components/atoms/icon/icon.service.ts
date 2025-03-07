import { Injectable } from '@angular/core';
import { iconsJson } from './icons';
import { IconDefinition, IconName } from './icons.types';

@Injectable({
  providedIn: 'root',
})
export class IconService {
  private icons = new Map<string, string>();

  constructor() {
    this.registerIcons(iconsJson);
  }

  registerIcons(icons: IconDefinition[]): void {
    icons.forEach((icon) => this.icons.set(icon.name, icon.svg));
  }

  getIcon(name: IconName): string | undefined {
    return this.icons.get(name);
  }
}
