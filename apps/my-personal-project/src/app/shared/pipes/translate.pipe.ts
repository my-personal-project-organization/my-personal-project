import { inject, Pipe, PipeTransform } from '@angular/core';
import { TranslationService } from '../services/translations/translation.service';

@Pipe({
  name: 'translate',
  standalone: true,
})
export class TranslatePipe implements PipeTransform {
  private readonly translationService = inject(TranslationService);

  transform(key: string): string {
    return this.translationService.translate(key);
  }
}
