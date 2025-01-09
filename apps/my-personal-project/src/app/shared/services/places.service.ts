// TODO: REMOVE just testing
import { inject, Injectable } from '@angular/core';
import { DdbbService } from '@my-personal-project/core';
import { Place } from '../types/place';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private readonly ddbbService = inject(DdbbService);

  addPlace(place: Place) {
    return this.ddbbService.add('places', place);
  }

  getPlaces() {
    return this.ddbbService.getAll<Place>('places');
  }
}
