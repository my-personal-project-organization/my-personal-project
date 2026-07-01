import {
  Directive,
  effect,
  inject,
  input,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { TranslationService } from '../services/translation.service';

@Directive({
  selector: '[ngForTranslate]',
  standalone: true,
})
export class NgForTranslateDirective {
  private readonly translationService = inject(TranslationService);
  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly templateRef = inject(TemplateRef<unknown>);

  /** Use: *ngForTranslate="let item; from: 'cv.landing.jobs'; let index = index" */
  public ngForTranslateFrom = input.required<string>();

  constructor() {
    effect(() => {
      const ngForTranslateFrom = this.ngForTranslateFrom();
      const translationsObject = this.translationService.getTranslations(ngForTranslateFrom);

      this.viewContainerRef.clear();
      if (translationsObject) {
        for (const key in translationsObject) {
          // eslint-disable-next-line no-prototype-builtins
          if (translationsObject.hasOwnProperty(key)) {
            const item =
              typeof translationsObject[key] === 'string'
                ? this.translationService.translate(`${ngForTranslateFrom}.${key}`)
                : translationsObject[key];
            this.viewContainerRef.createEmbeddedView(this.templateRef, {
              $implicit: item,
              index: key, // We pass the key as Index
            });
          }
        }
      }
    });
  }
}
