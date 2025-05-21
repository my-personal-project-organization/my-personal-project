/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { DialogComponent } from '@mpp/shared/ui';
import { NgForTranslateDirective, TranslatePipe, TranslationService } from '@mpp/shared/util-translation';
import { LandingComponent } from './landing.component';
import { LandingService } from './landing.service';

describe('LandingComponent', () => {
  let component: LandingComponent;
  let fixture: ComponentFixture<LandingComponent>;
  let mockTranslationService: any;

  beforeEach(async () => {
    mockTranslationService = {
      translate: jest.fn(),
      getTranslations: jest.fn(),
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
