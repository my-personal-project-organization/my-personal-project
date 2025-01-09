import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DialogComponent } from '@my-personal-project/ui';
import { NgForTranslateDirective } from '../../shared/directives/ng-for-translate.directive';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { PlacesService } from '../../shared/services/places.service';
import { TranslationService } from '../../shared/services/translations/translation.service';
import { Place } from '../../shared/types/place';
import { LandingPageService } from './landing-page.service';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [DialogComponent, TranslatePipe, NgForTranslateDirective],
  providers: [LandingPageService],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingPageComponent {
  private readonly translationService = inject(TranslationService);
  private readonly placesService = inject(PlacesService);

  dialogOpen = false;
  dialogTitle: string | undefined;
  listKey = '';

  openDialog(experience: string, listKey: string) {
    this.dialogTitle = this.translationService.translate(experience);
    this.listKey = listKey;
    this.dialogOpen = true;
    this.saveData();
  }

  closeDialog() {
    this.dialogOpen = false;
    this.listPlaces();
  }

  // TODO: REMOVE just testing
  async listPlaces() {
    const places = await this.placesService.getPlaces();
    places.subscribe((data) => {
      console.log('Places:', data);
    });
  }

  // TODO: REMOVE just testing
  async saveData() {
    const place: Place = {
      name: 'My Place 2',
      location: {
        lat: 10,
        lng: 10,
      },
      description: 'My Description',
      imageUrl: 'My Image Url',
    };
    const response = await this.placesService.addPlace(place);
    console.log('Response:', response);
  }
}
