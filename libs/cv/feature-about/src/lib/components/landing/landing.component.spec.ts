/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { DialogComponent } from '@mpp/shared/ui';
import { of } from 'rxjs';
import { NgForTranslateDirective } from '../../shared/directives/ng-for-translate.directive';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { PlacesService } from '../../shared/services/places.service';
import { TranslationService } from '../../shared/services/translations/translation.service';
import { LandingComponent } from './landing.component';
import { LandingService } from './landing.service';

describe('LandingComponent', () => {
  let component: LandingComponent;
  let fixture: ComponentFixture<LandingComponent>;
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
        LandingComponent,
        DialogComponent, // Add necessary imports
        TranslatePipe,
        NgForTranslateDirective,
      ],
      providers: [
        { provide: TranslationService, useValue: mockTranslationService },
        { provide: PlacesService, useValue: mockPlacesService },
        LandingService, //Provide LandingService
        { provide: ActivatedRoute, useValue: {} }, // Provide ActivatedRoute mock
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
