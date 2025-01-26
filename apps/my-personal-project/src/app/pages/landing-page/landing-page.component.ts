import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ArticleSchema } from '@mpp/scribo/data-access';
import { DialogComponent } from '@mpp/shared/ui';
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

  // TODO: REMOVE just testing
  testZod() {
    const articleData = {
      _id: 'some-id',
      userId: 'user-id',
      mainTitle: 'My Great Article',
      content: [
        {
          title: 'Section 1',
          items: [
            { type: 'description', value: '<p>Some formatted HTML</p>' },
            {
              type: 'image',
              value: 'https://example.com/image.jpg',
              footer: 'My Image',
            },
          ],
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const validatedArticle = ArticleSchema.parse(articleData); // Throws ZodError if validation fails

    // Or use safeParse:
    const result = ArticleSchema.safeParse(articleData);
    if (result.success) {
      const validatedArticle = result.data;
      // Do something with the validated article
    } else {
      // Handle the error (result.error)
      console.error(result.error.format());
    }
  }
}
