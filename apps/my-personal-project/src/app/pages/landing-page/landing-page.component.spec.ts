/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
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
        { provide: ActivatedRoute, useValue: {} }, // Provide ActivatedRoute mock
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LandingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
