// TODO: REMOVE just testing
import { inject, Injectable } from '@angular/core';
import { FirestoneService } from '@mpp/shared/data-access';
import { Place } from '../types/place';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private readonly firestoneService = inject(FirestoneService);

  addPlace(place: Place) {
    return this.firestoneService.add('places', place);
  }

  getPlaces() {
    return this.firestoneService.getAll<Place>('places');
  }
}
