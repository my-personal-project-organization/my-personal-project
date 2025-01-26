import {
  ChangeDetectionStrategy,
  Component,
  effect,
  HostBinding,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocalStorageService } from '@my-personal-project/core';

@Component({
  selector: 'ui-dark-mode-switcher',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dark-mode-switcher.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DarkModeSwitcherComponent {
  // * Injectors
  localStoreService = inject(LocalStorageService);

  @HostBinding('class.dark') get mode() {
    return this.darkMode();
  }

  darkMode = signal<boolean>(
    this.localStoreService.getData<boolean>('darkMode') ?? false,
  );

  constructor() {
    effect(() => {
      this.localStoreService.saveData<boolean>('darkMode', this.darkMode());
    });
  }

  // ********* EVENTS ********

  /**
   * Toggles the dark mode state.
   *
   * This method adds or removes the 'dark' class from the `<html>` element based on the current state of the `darkMode` signal.
   * It also updates the `darkMode` signal to reflect the new state.
   */
  onToggleDarkMode() {
    console.log('Dark mode toggled!');
    const htmlEl = document.getElementsByTagName('html')[0];
    if (htmlEl) {
      if (this.darkMode()) {
        htmlEl.classList.remove('dark');
        this.darkMode.set(false);
      } else {
        htmlEl.classList.add('dark');
        this.darkMode.set(true);
      }
    }
  }
}
