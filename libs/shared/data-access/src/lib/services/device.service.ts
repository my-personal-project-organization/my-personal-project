import { DOCUMENT } from '@angular/common';
import { inject, Injectable, Signal } from '@angular/core';
import { fromEvent, startWith, map, distinctUntilChanged } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root', // This makes the service available throughout the application
})
export class DeviceService {
  private readonly document = inject(DOCUMENT);
  private window = this.document.defaultView!;
  public device = toSignal(
    fromEvent(this.window, 'resize').pipe(
      startWith(window.innerWidth),
      map(() => {
        const mobile = window.innerWidth < 768;
        const tablet = window.innerWidth >= 768 && window.innerWidth < 1024;
        if (mobile) {
          return 'mobile';
        }
        if (tablet) {
          return 'tablet';
        }
        return 'desktop';
      }),
      distinctUntilChanged(),
    ),
  ) as Signal<'desktop' | 'mobile' | 'tablet'>;
}
