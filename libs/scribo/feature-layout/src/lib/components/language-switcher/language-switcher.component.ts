// ...existing code...
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  isDevMode,
  LOCALE_ID,
  PLATFORM_ID,
  signal,
} from '@angular/core';

export const SUPPORTED_LANGUAGES = {
  EN_US: 'en-US',
  ES: 'es',
} as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[keyof typeof SUPPORTED_LANGUAGES];

@Component({
  selector: 'scrb-layout-language-switcher',
  templateUrl: './language-switcher.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageSwitcherComponent {
  private readonly _document = inject(DOCUMENT);
  private readonly _platformId = inject(PLATFORM_ID);

  readonly currentLocale = signal(inject(LOCALE_ID));
  readonly isProduction = signal(!isDevMode());
  readonly isBrowser = signal(isPlatformBrowser(this._platformId));

  readonly LANGUAGES = SUPPORTED_LANGUAGES;

  switchToLanguage(targetLocale: SupportedLanguage): void {
    if (!this.isBrowser() || !this.isProduction()) {
      // Component's template already gates rendering, but this is a safeguard.
      return;
    }

    const currentActiveLocale = this.currentLocale();
    if (currentActiveLocale === targetLocale) {
      return; // Already in the target language
    }

    const window = this._document.defaultView;
    if (!window) {
      return;
    }

    const { pathname, search, hash, origin } = window.location;
    let newPathname: string;

    const expectedPrefix = `/${currentActiveLocale}`;

    if (pathname.toLowerCase().startsWith(expectedPrefix.toLowerCase())) {
      const basePath = pathname.substring(expectedPrefix.length);
      newPathname = `/${targetLocale}${basePath || '/'}`; // Ensure basePath like "" becomes "/"
    } else {
      // Handles cases where the default locale (e.g., en-US) might be served from the root.
      // Or if the path somehow doesn't have the expected prefix.
      if (
        currentActiveLocale === SUPPORTED_LANGUAGES.EN_US ||
        currentActiveLocale === SUPPORTED_LANGUAGES.ES
      ) {
        newPathname = `/${targetLocale}${pathname.startsWith('/') ? pathname : `/${pathname}`}`;
      } else {
        console.error(
          `Cannot switch language: Current path "${pathname}" does not align with locale "${currentActiveLocale}".`,
        );
        return;
      }
    }

    // Normalize potential double slashes, e.g. /es//foo -> /es/foo or /es// -> /es/
    newPathname = newPathname.replace(/\/\//g, '/');
    if (newPathname !== '/' && newPathname.endsWith('/')) {
      newPathname = newPathname.slice(0, -1); // Avoid trailing slash unless it's the root
    }
    if (newPathname === '') newPathname = '/'; // Ensure root path is represented correctly

    const newUrl = `${origin}${newPathname || '/'}${search}${hash}`;
    window.location.href = newUrl;
  }
}
