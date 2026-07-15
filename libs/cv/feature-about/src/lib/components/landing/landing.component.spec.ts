/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { DialogComponent } from '@mpp/shared/ui';
import { NgForTranslateDirective, TranslatePipe, TranslationService } from '@mpp/shared/util-translation';
import { By } from '@angular/platform-browser';
import { LandingComponent } from './landing.component';
import { LandingService } from './landing.service';

describe('LandingComponent', () => {
  let component: LandingComponent;
  let fixture: ComponentFixture<LandingComponent>;
  let mockTranslationService: any;

  beforeEach(async () => {
    mockTranslationService = {
      translate: jest.fn((key: string) => `translated:${key}`),
      getTranslations: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [
        LandingComponent,
        DialogComponent,
        TranslatePipe,
        NgForTranslateDirective,
      ],
      providers: [
        { provide: TranslationService, useValue: mockTranslationService },
        LandingService,
        { provide: ActivatedRoute, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start with the dialog closed and default state', () => {
    // Assert
    expect(component.dialogOpen()).toBe(false);
    expect(component.dialogTitle()).toBeUndefined();
    expect(component.listKey()).toBe('');
    expect(fixture.debugElement.query(By.directive(DialogComponent))).toBeNull();
  });

  describe('openDialog', () => {
    it('should set the dialog signals from the given experience and listKey', () => {
      // Act
      component.openDialog('cv.landing.jobs.0.title', 'cv.landing.jobs.0.key-points');

      // Assert
      expect(mockTranslationService.translate).toHaveBeenCalledWith('cv.landing.jobs.0.title');
      expect(component.dialogTitle()).toBe('translated:cv.landing.jobs.0.title');
      expect(component.listKey()).toBe('cv.landing.jobs.0.key-points');
      expect(component.dialogOpen()).toBe(true);
    });

    it('should render the ui-dialog with the bound state once opened', () => {
      // Act
      component.openDialog('cv.landing.jobs.0.title', 'cv.landing.jobs.0.key-points');
      fixture.detectChanges();

      // Assert
      const dialogDebugEl = fixture.debugElement.query(By.directive(DialogComponent));
      expect(dialogDebugEl).toBeTruthy();
      const dialog = dialogDebugEl.componentInstance as DialogComponent;
      expect(dialog.isOpen()).toBe(true);
      expect(dialog.title()).toBe('translated:cv.landing.jobs.0.title');
    });
  });

  describe('closeDialog', () => {
    it('should close the dialog and remove the ui-dialog from the DOM', () => {
      // Arrange
      component.openDialog('cv.landing.jobs.0.title', 'cv.landing.jobs.0.key-points');
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.directive(DialogComponent))).toBeTruthy();

      // Act
      component.closeDialog();
      fixture.detectChanges();

      // Assert
      expect(component.dialogOpen()).toBe(false);
      expect(fixture.debugElement.query(By.directive(DialogComponent))).toBeNull();
    });
  });
});
