import { inject } from '@angular/core';
import { TranslationService } from '@mpp/shared/util-translation';
import { cvLandingPageTranslations } from './cv-landing-page.translations';
import { scriboLandingPageTranslations } from './sc-landing-page.translations';
import { scriboLayoutTranslations } from './sc-layout.translations';

export function loadAppTranslations() {
  return () => {
    const translationService = inject(TranslationService);
    return translationService.loadTranslations({
      cv: {
        landing: cvLandingPageTranslations,
      },
      sc: {
        landing: scriboLandingPageTranslations,
        layout: scriboLayoutTranslations,
      },
    });
  };
}
