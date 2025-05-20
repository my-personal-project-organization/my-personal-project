import {
  Directive,
  inject,
  input,
  OnChanges,
  SimpleChanges,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { TranslationService } from '../services/translations/translation.service';

@Directive({
  selector: '[ngForTranslate]',
  standalone: true,
})
export class NgForTranslateDirective implements OnChanges {
  private readonly translationService = inject(TranslationService);
  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly templateRef = inject(TemplateRef<unknown>);

  /** Use: *ngForTranslate="let item; from: 'landing.jobs'; let index = index" */
  public ngForTranslateFrom = input.required<string>();

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['ngForTranslateFrom'] &&
      changes['ngForTranslateFrom']?.currentValue
    ) {
      const ngForTranslateFrom = changes['ngForTranslateFrom']?.currentValue;
      const translationsObject =
        this.translationService.getTranslations(ngForTranslateFrom);

      if (translationsObject) {
        for (const key in translationsObject) {
          // eslint-disable-next-line no-prototype-builtins
          if (translationsObject.hasOwnProperty(key)) {
            const item =
              typeof translationsObject[key] === 'string'
                ? this.translationService.translate(
                    `${ngForTranslateFrom}.${key}`,
                  )
                : translationsObject[key];
            this.viewContainerRef.createEmbeddedView(this.templateRef, {
              $implicit: item,
              index: key, // We pass the key as Index
            });
          }
        }
      }
    }
  }
}
