/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-require-imports */
const { ReadableStream } = require('node:util');
Object.defineProperties(globalThis, {
  ReadableStream: { value: ReadableStream },
});
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DialogComponent } from '@mpp/shared/ui';
import { of } from 'rxjs';
import { NgForTranslateDirective } from '../../shared/directives/ng-for-translate.directive';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { PlacesService } from '../../shared/services/places.service';
import { TranslationService } from '../../shared/services/translations/translation.service';
import { LandingPageComponent } from './landing-page.component';
import { LandingPageService } from './landing-page.service';

describe('LandingPageComponent', () => {
  let component: LandingPageComponent;
  let fixture: ComponentFixture<LandingPageComponent>;
  let mockTranslationService: any;
  let mockPlacesService: any;

  beforeEach(async () => {
    mockTranslationService = {
      translate: jest.fn(),
      getTranslations: jest.fn(),
    };

    mockPlacesService = {
      getPlaces: jest.fn().mockReturnValue(of([])), // Mock getPlaces to return an observable
      addPlace: jest.fn().mockResolvedValue(true), // Mock addPlace to return a promise
    };
    await TestBed.configureTestingModule({
      imports: [
        LandingPageComponent,
        DialogComponent, // Add necessary imports
        TranslatePipe,
        NgForTranslateDirective,
      ],
      providers: [
        { provide: TranslationService, useValue: mockTranslationService },
        { provide: PlacesService, useValue: mockPlacesService },
        LandingPageService, //Provide LandingPageService
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LandingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open dialog and call addPlace', async () => {
    // Changed test name and made async
    const experience = 'testExperience';
    const listKey = 'testListKey';
    await component.openDialog(experience, listKey); // Await openDialog because saveData is called inside it.

    expect(mockTranslationService.translate).toHaveBeenCalledWith(experience);
    expect(component.dialogOpen).toBe(true);
    expect(component.listKey).toBe(listKey);
    expect(mockPlacesService.addPlace).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'My Place 2' }),
    ); // Use expect.objectContaining for partial matching
  });
  it('should close dialog', async () => {
    // made async
    const mockListPlaces = jest.fn(); // Mock listPlaces
    component.listPlaces = mockListPlaces; // Replace the original method with the mock

    component.dialogOpen = true;
    await component.closeDialog(); // await closeDialog to ensure listPlaces is called
    expect(component.dialogOpen).toBe(false);
    expect(mockListPlaces).toHaveBeenCalled(); //Assert that the mocked function was called
  });
});
