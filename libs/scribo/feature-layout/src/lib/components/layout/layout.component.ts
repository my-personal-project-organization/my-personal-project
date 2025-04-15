import { ChangeDetectionStrategy, Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AuthStore } from '@mpp/shared/data-access';
import { ButtonComponent, NavBarComponent } from '@mpp/shared/ui';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'scrb-layout',
  imports: [RouterOutlet, NavBarComponent, FooterComponent, ButtonComponent, NavBarComponent, RouterModule],
  templateUrl: './layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScriboFeatureLayoutComponent {
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
