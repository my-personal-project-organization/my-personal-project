import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { DialogComponent, IconComponent } from '@mpp/shared/ui';
import { LandingService } from './landing.service';
import { NgForTranslateDirective, TranslatePipe, TranslationService } from '@mpp/shared/util-translation';
import { FooterComponent } from '../footer/footer.component';

import { FormsModule } from "@angular/forms";

@Component({
  selector: 'feature-about-landing',
  standalone: true,
  imports: [DialogComponent, TranslatePipe, NgForTranslateDirective, FooterComponent, IconComponent, FormsModule],
  providers: [LandingService],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingComponent {
  private readonly translationService = inject(TranslationService);
  private readonly router = inject(Router);

  readonly dialogOpen = signal(false);
  readonly dialogTitle = signal<string | undefined>(undefined);
  readonly listKey = signal('');

  openDialog(experience: string, listKey: string) {
    this.dialogTitle.set(this.translationService.translate(experience));
    this.listKey.set(listKey);
    this.dialogOpen.set(true);
  }

  closeDialog() {
    this.dialogOpen.set(false);
  }

  onCLickScriboProject() {
    this.router.navigate(['/scribo']);
  }

  onClickDjGasparProject(): void {
    window.open('https://dj-gaspar.vercel.app/', '_blank');
  }
}
