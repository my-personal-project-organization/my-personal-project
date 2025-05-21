import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ToastContainerComponent } from '@mpp/shared/ui';
import { AppService } from './app.service';

@Component({
  standalone: true,
  imports: [RouterModule, ToastContainerComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [AppService],
})
export class AppComponent {
  private readonly appService = inject(AppService);

  title = this.appService.setTitle();
}
