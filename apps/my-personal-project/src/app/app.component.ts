import { Component, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { APP_CONFIG } from '../environments/app-config.token';

@Component({
  standalone: true,
  imports: [RouterModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private readonly titleService = inject(Title);
  private readonly appConfig = inject(APP_CONFIG);

  title = this.titleService.setTitle(
    $localize`:@@app.title:My Personal Project`,
  );

  // TODO: Remove on next task
  constructor() {
    console.log(this.appConfig.apiUrl);
  }
}
