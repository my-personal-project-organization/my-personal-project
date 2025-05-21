import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IconComponent } from '@mpp/shared/ui';
import { TranslatePipe } from '@mpp/shared/util-translation';

@Component({
  selector: 'scrb-layout-footer',
  templateUrl: './footer.component.html',
  imports: [RouterModule, IconComponent, TranslatePipe],
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
