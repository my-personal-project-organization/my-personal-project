import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { AuthStore } from '@mpp/shared/data-access';
import { ButtonComponent, DarkModeSwitcherComponent, NavBarComponent } from '@mpp/shared/ui';
import { TranslatePipe } from '@mpp/shared/util-translation';
import { LanguageSwitcherComponent } from '../language-switcher/language-switcher.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'scrb-layout-nav',
  imports: [
    NavBarComponent,
    ButtonComponent,
    TranslatePipe,
    LanguageSwitcherComponent,
    DarkModeSwitcherComponent,
    RouterLink,
  ],
  templateUrl: './nav.component.html',
})
export class NavComponent {
  @ViewChild('sidebarTemplate') sidebarTemplate!: TemplateRef<any>;
  private readonly authStore = inject(AuthStore);
  isAuthenticated = this.authStore.isAuthenticated;
  user = this.authStore.user;

  login(): void {
    this.authStore.signInWithGithub();
  }

  logout(): void {
    this.authStore.signOutUser();
  }
}
