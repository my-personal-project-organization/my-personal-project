import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { DialogComponent } from '@mpp/shared/ui';
import { LandingService } from './landing.service';
import { NgForTranslateDirective, TranslatePipe, TranslationService } from '@mpp/shared/util-translation';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'feature-about-landing',
  standalone: true,
  imports: [DialogComponent, TranslatePipe, NgForTranslateDirective, FooterComponent],
  providers: [LandingService],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingComponent {
  private readonly translationService = inject(TranslationService);
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
