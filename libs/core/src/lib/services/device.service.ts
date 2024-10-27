import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { fromEvent, startWith, map, distinctUntilChanged } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root', // This makes the service available throughout the application
})
export class DeviceService {
  private readonly document = inject(DOCUMENT);
  /**
   * Returns a Signal that emits the type of device ('desktop', 'mobile', or 'tablet') based on the current window width.
   *
   * The Signal listens for window resize events and updates the device type accordingly.
   * It only emits a new value if the device type changes.
   *
   * @return a Signal that emits the type of device
   */
  getDevice() {
    const window = this.document.defaultView!;
    return toSignal(
      fromEvent(window, 'resize').pipe(
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
    );
  }
}
