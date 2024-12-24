import { Injectable } from '@angular/core';

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
    landing: {
      title: $localize`:@@landing.title:My experiences`,
      jobs: {
        3: {
          title: $localize`:@@landing.jobs.3.title:Senior Front End Angular Developer`,
          description: $localize`:@@landing.jobs.3.description:GBTEC Group · Full-time · Dec 2024 - Present · Vigo, Galicia, Spain · Remote`,
          keyPoints: {
            0: $localize`:@@landing.jobs.3.keyPoints.0:Developing an Angular app.`,
          },
        },
        2: {
          title: $localize`:@@landing.jobs.2.title:Frontend Manager`,
          description: $localize`:@@landing.jobs.2.description:BizAway · Full-time · Jul 2023 - Dec 2024 · Vigo, Galicia, Spain · Remote`,
          keyPoints: {
            0: $localize`:@@landing.jobs.2.keyPoints.0:Managed and provided technical leadership to 4 front-end development teams.`,
            1: $localize`:@@landing.jobs.2.keyPoints.1:Played a key role in scaling the company's engineering organization.`,
            2: $localize`:@@landing.jobs.2.keyPoints.2:Defined and implemented front-end development standards and best practices.`,
            3: $localize`:@@landing.jobs.2.keyPoints.3:Collaborated with cross-functional teams.`,
            4: $localize`:@@landing.jobs.2.keyPoints.4:Actively participated in design reviews using Figma.`,
            5: $localize`:@@landing.jobs.2.keyPoints.5:Mentored and developed junior and mid-level developers.`,
            6: $localize`:@@landing.jobs.2.keyPoints.6:Conducted performance reviews.`,
            7: $localize`:@@landing.jobs.2.keyPoints.7:Developed Bitbucket pipelines for CI/CD.`,
            8: $localize`:@@landing.jobs.2.keyPoints.8:Drove innovation within the team.`,
          },
        },
        // secondJob: {
        //   title: $localize`:@@landing.secondJob.title:FAAAA`,
        //   description: $localize`:@@landing.secondJob.description:AAAA`,
        //   firstPoint: $localize`:@@landing.secondJob.firstPoint:AAAAAA`,
        // },
        // firstJob: {
        //   title: $localize`:@@landing.firstJob.title:FAAAA`,
        //   description: $localize`:@@landing.firstJob.description:AAAA`,
        //   firstPoint: $localize`:@@landing.firstJob.firstPoint:AAAAAA`,
        // },
      },
    },
  };
}
