import { Injectable } from '@angular/core';
import { landingPageTranslations } from './landing-page.translations';

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  /**
   * The function `translate` takes a key as input, retrieves the corresponding value from a nested
   * object structure, and returns the translated string or the original key if not found.
   * @param {string} key - The `translate` function takes a `key` parameter, which is a string.
   * @returns The `translate` function returns the translated string or the original key if not found.
   */
  translate(key: string): string {
    if (key === null || key === undefined || typeof key !== 'string') {
      return 'translate key is not string';
    }
    if (key === '') {
      return '';
    }

    const keys = key.split('.');
    let current: unknown = this.translations;

    for (const k of keys) {
      if (typeof current === 'object' && current !== null && k in current) {
        current = (current as Record<string, unknown>)[k];
      } else {
        return key;
      }
    }

    if (typeof current === 'string') {
      return current;
    } else {
      return key;
    }
  }

  /**
   * The function `getTranslations` retrieves nested translations based on a given key in TypeScript.
   * The main purpose is to be used by ngForTranslate pipe.
   */
  getTranslations(key: string): { [key: string]: string | object } | undefined {
    const keys = key.split('.');
    let current: unknown = this.translations;

    for (const k of keys) {
      if (typeof current === 'object' && current !== null && k in current) {
        current = (current as Record<string, unknown>)[k];
      } else {
        return undefined;
      }
    }

    if (typeof current === 'object' && current !== null) {
      return current as { [key: string]: string };
    }
    return undefined;
  }

  translations: { [key: string]: unknown } = {
    landing: landingPageTranslations,
  };
}
