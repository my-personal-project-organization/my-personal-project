import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthStore } from '@mpp/shared/data-access';
import { TranslatePipe } from '@mpp/shared/util-translation';
import { ButtonComponent } from '@mpp/shared/ui';
import { features } from './landing.features';

@Component({
  selector: 'scrb-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
  imports: [ButtonComponent, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingComponent {
  private readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);
  features = features;

  async onStartBtnClick() {
    await this.authStore.signInWithGithub();
    this.router.navigate(['/scribo/list']);
  }
}
