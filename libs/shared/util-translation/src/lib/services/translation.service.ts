import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  private translations: Record<string, unknown> = {};
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
    let current: Record<string, unknown> = this.translations;

    for (const k of keys) {
      if (typeof current === 'object' && current !== null && k in current) {
        current = current[k] as Record<string, unknown>;
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
  getTranslations(key: string): Record<string, unknown> | undefined {
    if (key === null || key === undefined || typeof key !== 'string') {
      return undefined;
    }
    if (key === '') {
      return this.translations;
    }
    const keys = key.split('.');
    let current = this.translations;

    for (const k of keys) {
      if (typeof current === 'object' && current !== null && k in current) {
        current = current[k] as Record<string, unknown>;
      } else {
        return undefined;
      }
    }

    if (typeof current === 'object' && current !== null) {
      return current as { [key: string]: string };
    }
    return undefined;
  }

  loadTranslations(translations: Record<string, unknown>): void {
    if (Object.keys(this.translations).length !== 0) {
      throw new Error('Translations object is already loaded');
    }
    if (translations === null || translations === undefined || typeof translations !== 'object') {
      throw new Error('Translations must be an object');
    }
    if (Object.keys(translations).length === 0) {
      throw new Error('Translations object is empty');
    }
    this.translations = translations;
  }
}
