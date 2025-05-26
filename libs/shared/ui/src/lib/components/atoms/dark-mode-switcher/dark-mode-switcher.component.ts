import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, HostBinding, inject, signal } from '@angular/core';
import { LocalStorageService } from '@mpp/shared/data-access';
import { IconComponent } from '../icon';

@Component({
  selector: 'ui-dark-mode-switcher',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './dark-mode-switcher.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DarkModeSwitcherComponent {
  // * Injectors
  localStoreService = inject(LocalStorageService);

  @HostBinding('class.dark') get mode() {
    return this.isDarkMode();
  }

  isDarkMode = signal<boolean>(this.localStoreService.getData<boolean>('darkMode') ?? false);

  constructor() {
    effect(() => {
      this.saveDarkModeOnLocalStorage(this.isDarkMode());
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
    const htmlEl = document.getElementsByTagName('html')[0];
    if (htmlEl) {
      if (this.isDarkMode()) {
        htmlEl.classList.remove('dark');
        this.isDarkMode.set(false);
      } else {
        htmlEl.classList.add('dark');
        this.isDarkMode.set(true);
      }
    }
  }

  // ************* Private functions ********************
  saveDarkModeOnLocalStorage(isDarkMode: boolean) {
    const htmlElClasses = document.getElementsByTagName('html')[0]?.classList;
    const isWindowDarkMode = htmlElClasses.value === 'dark';

    if (isDarkMode && isWindowDarkMode !== isDarkMode) {
      htmlElClasses.add('dark');
    } else {
      this.localStoreService.saveData<boolean>('darkMode', isDarkMode);
    }
  }
}
