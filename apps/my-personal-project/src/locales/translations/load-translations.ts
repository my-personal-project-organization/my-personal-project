import { inject } from '@angular/core';
import { TranslationService } from '@mpp/shared/data-access';
import { cvLandingPageTranslations } from './cv-landing-page.translations';
import { scriboLandingPageTranslations } from './scribo-landing-page.translations';

export function loadAppTranslations() {
  return () => {
    const translationService = inject(TranslationService);
    return translationService.loadTranslations({
      cv: {
        landing: cvLandingPageTranslations,
      },
      sc: {
        landing: scriboLandingPageTranslations,
      },
    });
  };
}
