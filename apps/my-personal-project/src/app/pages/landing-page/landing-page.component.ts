import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DialogComponent } from '@my-personal-project/ui';
import { NgForTranslateDirective } from '../../shared/directives/ng-for-translate.directive';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { TranslationService } from '../../shared/services/translations/translation.service';
import { LandingPageService } from './landing-page.service';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [DialogComponent, TranslatePipe, NgForTranslateDirective],
  providers: [LandingPageService],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingPageComponent {
  private readonly translationService = inject(TranslationService);

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
}
