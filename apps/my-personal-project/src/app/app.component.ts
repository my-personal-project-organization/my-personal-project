import { Component, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  // Inject the Title service to set the title of the app
  titleService = inject(Title);

  title = this.titleService.setTitle(
    $localize`:@@app.title:My Personal Project`,
  );
}
