import { inject } from '@angular/core';
import { TranslationService } from '@mpp/shared/data-access';
import { landingPageTranslations } from './landing-page.translations';

export function loadAppTranslations() {
  return () => {
    const translationService = inject(TranslationService);
    return translationService.loadTranslations({
      landing: landingPageTranslations,
    });
  };
}
