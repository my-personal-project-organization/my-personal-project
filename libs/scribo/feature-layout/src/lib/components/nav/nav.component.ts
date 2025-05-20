import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { AuthStore, TranslatePipe } from '@mpp/shared/data-access';
import { ButtonComponent, NavBarComponent } from '@mpp/shared/ui';

@Component({
  selector: 'scrb-layout-nav',
  imports: [NavBarComponent, ButtonComponent, TranslatePipe],
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
