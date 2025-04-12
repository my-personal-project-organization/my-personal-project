import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IconComponent } from '@mpp/shared/ui';

@Component({
  selector: 'scrb-layout-footer',
  templateUrl: './footer.component.html',
  imports: [RouterModule, IconComponent],
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
