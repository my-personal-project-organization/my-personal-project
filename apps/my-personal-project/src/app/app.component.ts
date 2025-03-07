import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppService } from './app.service';

@Component({
  standalone: true,
  imports: [RouterModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [AppService],
})
export class AppComponent {
  private readonly appService = inject(AppService);

  title = this.appService.setTitle();
}
