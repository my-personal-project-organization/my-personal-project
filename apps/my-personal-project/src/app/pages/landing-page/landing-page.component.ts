import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { DialogComponent } from '@mpp/shared/ui';
import { NgForTranslateDirective } from '../../shared/directives/ng-for-translate.directive';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { PlacesService } from '../../shared/services/places.service';
import { TranslationService } from '../../shared/services/translations/translation.service';
import { FooterComponent } from './components/footer/footer.component';
import { LandingPageService } from './landing-page.service';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [DialogComponent, TranslatePipe, NgForTranslateDirective, FooterComponent],
  providers: [LandingPageService],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingPageComponent {
  private readonly translationService = inject(TranslationService);
  private readonly placesService = inject(PlacesService);
  private readonly router = inject(Router);

  dialogOpen = false;
  dialogTitle: string | undefined;
  listKey = '';

  openDialog(experience: string, listKey: string) {
    this.dialogTitle = this.translationService.translate(experience);
    this.listKey = listKey;
    this.dialogOpen = true;
  }

  closeDialog() {
    this.dialogOpen = false;
  }

  onCLickScriboProject() {
    this.router.navigate(['/scribo']);
  }
}
