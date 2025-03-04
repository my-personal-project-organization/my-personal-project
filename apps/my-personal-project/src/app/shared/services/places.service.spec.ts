/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-require-imports */
const { ReadableStream } = require('node:util');
Object.defineProperties(globalThis, {
  ReadableStream: { value: ReadableStream },
});
import { TestBed } from '@angular/core/testing';
import { FirestoneService } from '@mpp/shared/data-access';
import { Place } from '../types/place';
import { PlacesService } from './places.service';

describe('Service: Places', () => {
  let firestoneServiceMock: any; // Mock the FirestoneService

  beforeEach(() => {
    firestoneServiceMock = {
      add: jest.fn().mockResolvedValue(true),
      getAll: jest.fn().mockResolvedValue([]),
    };

    TestBed.configureTestingModule({
      providers: [
        PlacesService,
        { provide: FirestoneService, useValue: firestoneServiceMock },
      ],
    });
  });

  it('should be created', () => {
    const service: PlacesService = TestBed.inject(PlacesService);
    expect(service).toBeTruthy();
  });

  it('should add a place', async () => {
    const service: PlacesService = TestBed.inject(PlacesService);
    const place: Place = {
      id: '1',
      name: 'Test Place',
      description: 'Test Description',
      imageUrl: 'https://test.com/image.jpg',
      location: {
        lat: 123,
        lng: 456,
      },
    };
    await service.addPlace(place);
    expect(firestoneServiceMock.add).toHaveBeenCalledWith('places', place);
  });

  it('should get places', () => {
    const service: PlacesService = TestBed.inject(PlacesService);
    service.getPlaces();
    expect(firestoneServiceMock.getAll).toHaveBeenCalledWith('places');
  });
});
