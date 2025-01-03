import { Component, inject } from '@angular/core';
import { $localize } from '@angular/localize/init';
import { Title } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { environment } from '../environments/environment';

@Component({
  standalone: true,
  imports: [RouterModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  public readonly titleService = inject(Title);

  title = this.titleService.setTitle(
    $localize`:@@app.title:My Personal Project`,
  );

  // TODO: Remove on next task
  constructor() {
    const aa = environment.firebaseApiKey;
    console.log(aa);
  }
}
