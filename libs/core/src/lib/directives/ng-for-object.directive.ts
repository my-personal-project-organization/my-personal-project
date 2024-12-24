import {
  Directive,
  inject,
  input,
  OnChanges,
  SimpleChanges,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';

@Directive({
  selector: '[ngForObject]',
  standalone: true,
})
export class NgForObjectDirective implements OnChanges {
  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly templateRef = inject(TemplateRef<unknown>);

  /** Use: *ngForObject="let item; from: myObject; let index = index"  */
  public ngForObjectFrom = input.required<{ [key: string]: unknown }>();

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['ngForObjectFrom'] &&
      changes['ngForObjectFrom']?.currentValue
    ) {
      const currentValue = changes['ngForObjectFrom']?.currentValue;
      const propertyNames = Object.keys(currentValue);

      // remove all views
      this.viewContainerRef.clear();
      propertyNames.forEach((propertyName: string, index: number) => {
        // create a new view for each property
        this.viewContainerRef.createEmbeddedView(this.templateRef, {
          // default value that will be used if an attribute is not assigned one
          $implicit: currentValue[propertyName],
          index,
        });
      });
    }
  }
}
