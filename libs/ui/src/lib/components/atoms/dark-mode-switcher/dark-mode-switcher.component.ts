import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ui-dark-mode-switcher',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dark-mode-switcher.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DarkModeSwitcherComponent {
  public isDark = true;
  // ********* EVENTS ********
  onToggleDarkMode() {
    // TODO: Implement dark mode logic
    console.log('Dark mode toggled!');
    const htmlEl = document.getElementsByTagName('html')[0];
    if (htmlEl) {
      if (this.isDark) {
        htmlEl.classList.add('dark');
        this.isDark = false;
      } else {
        htmlEl.classList.remove('dark');
        this.isDark = true;
      }
    }
  }
}
