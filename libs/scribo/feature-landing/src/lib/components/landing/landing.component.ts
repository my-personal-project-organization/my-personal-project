import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthStore } from '@mpp/shared/data-access';
import { ButtonComponent } from '@mpp/shared/ui';
import { features } from './landing.features';

@Component({
  selector: 'scrb-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
  imports: [ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingComponent {
  private readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);
  features = features;

  constructor() {
    effect(() => {
      if (this.authStore.isAuthenticated()) {
        this.router.navigate(['/scribo/list']);
      }
    });
  }

  onStartBtnClick(): void {
    this.authStore.signInWithGithub();
  }
}
