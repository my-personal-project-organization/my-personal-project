import { inject, Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Injectable()
export class AppService {
  public readonly titleService = inject(Title);

  setTitle() {
    return this.titleService.setTitle($localize`:@@app.title:My Personal Project`);
  }
}
