/* eslint-disable @typescript-eslint/no-explicit-any */
import { TestBed } from '@angular/core/testing';
import { TranslationService } from './translation.service'; // Adjust path as needed

describe('TranslationService', () => {
  let service: TranslationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TranslationService);

    // Load test translations
    service.loadTranslations({
      cv: {
        landing: {
          title: 'My experiences',
          jobs: {
            '2': {
              title: 'Frontend Manager',
              description: 'BizAway · Full-time · Jul 2023 - Dec 2024 · Vigo, Galicia, Spain · Remote',
              'key-points': {
                '0': 'Managed and provided technical leadership to 4 front-end development teams.',
                '1': "Played a key role in scaling the company's engineering organization.",
                '2': 'Defined and implemented front-end development standards and best practices.',
                '3': 'Collaborated with cross-functional teams.',
                '4': 'Actively participated in design reviews using Figma.',
                '5': 'Mentored and developed junior and mid-level developers.',
                '6': 'Conducted performance reviews.',
                '7': 'Developed Bitbucket pipelines for CI/CD.',
                '8': 'Drove innovation within the team.',
              },
            },
            '3': {
              title: 'Senior Front End Angular Developer',
            },
          },
        },
      },
    });
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should translate existing keys', () => {
    expect(service.translate('cv.landing.title')).toBe('My experiences');
    expect(service.translate('cv.landing.jobs.3.title')).toBe('Senior Front End Angular Developer');
    expect(service.translate('cv.landing.jobs.2.key-points.5')).toBe(
      'Mentored and developed junior and mid-level developers.',
    );
  });

  it('should return the key for non-existent keys', () => {
    expect(service.translate('non.existent.key')).toBe('non.existent.key');
    expect(service.translate('cv.landing.jobs.4')).toBe('cv.landing.jobs.4'); // Even if parent exists
    expect(service.translate('cv.landing.jobs.2.key-points.99')).toBe('cv.landing.jobs.2.key-points.99');
  });

  it('should return the key for invalid keys (e.g., number, objects)', () => {
    expect(service.translate(123 as any)).toBe('translate key is not string'); // Handle incorrect types
    expect(service.translate({} as any)).toBe('translate key is not string');
    expect(service.translate([] as any)).toBe('translate key is not string');
    expect(service.translate(null as any)).toBe('translate key is not string'); // Check how null/undefined are handled
    expect(service.translate(undefined as any)).toBe('translate key is not string');
  });

  it('should handle empty key string', () => {
    expect(service.translate('')).toBe('');
  });

  describe('getTranslations', () => {
    it('should retrieve nested translations for a valid key', () => {
      const translations = service.getTranslations('cv.landing.jobs.2');
      expect(translations).toBeDefined();
      const title = translations ? translations['title'] : undefined;
      expect(title).toBe('Frontend Manager'); // Accessing using optional chaining (?.)
    });

    it('should return undefined for a non-existent key', () => {
      const translations = service.getTranslations('non.existent.key');
      expect(translations).toBeUndefined();
    });

    it('should return undefined for invalid keys', () => {
      expect(service.getTranslations(123 as any)).toBeUndefined();
      expect(service.getTranslations({} as any)).toBeUndefined();
      expect(service.getTranslations(null as any)).toBeUndefined();
      expect(service.getTranslations(undefined as any)).toBeUndefined();
    });

    it('should handle empty key string', () => {
      const translations = service.getTranslations('');
      expect(translations).toBeDefined(); // Should return the root translations object
      expect(typeof translations).toBe('object');
    });
  });
});
