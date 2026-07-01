import { Component, NO_ERRORS_SCHEMA, signal, ChangeDetectionStrategy } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgForTranslateDirective } from './ng-for-translate.directive';
import { TranslationService } from '../services/translation.service';

@Component({
  standalone: true,
  imports: [NgForTranslateDirective],
  template: `
    <ng-container *ngForTranslate="let item; let i = index; from: translationKey()">
      <div id="translation-{{ i }}">{{ item }}</div>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class TestHostComponent {
  translationKey = signal<string | undefined>(undefined);
}

describe('NgForTranslateDirective', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [TranslationService],
    }).compileComponents();

    // Load test translations
    const translationService = TestBed.inject(TranslationService);
    translationService.loadTranslations({
      cv: {
        landing: {
          jobs: {
            '2': {
              title: 'Frontend Manager',
              description: 'BizAway · Full-time · Jul 2023 - Dec 2024 · Vigo, Galicia, Spain · Remote',
              'key-points': {
                '0': 'Managed and provided technical leadership to 4 front-end development teams.',
                '1': "Played a key role in scaling the company's engineering organization.",
                '2': 'Defined and implemented front-end development standards and best practices.',
                '3': 'Collaborated with cross-functional teams.',
                '4': 'Actively participated in design reviews using Figma.',
                '5': 'Mentored and developed junior and mid-level developers.',
                '6': 'Conducted performance reviews.',
                '7': 'Developed Bitbucket pipelines for CI/CD.',
                '8': 'Drove innovation within the team.',
              },
            },
          },
        },
      },
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should iterate and translate correctly', () => {
    component.translationKey.set('cv.landing.jobs.2.key-points');
    fixture.detectChanges();
    const divs = fixture.nativeElement.querySelectorAll('div');
    expect(divs.length).toBe(9);
    expect(divs[0].textContent).toContain(
      'Managed and provided technical leadership to 4 front-end development teams.',
    );
    expect(divs[1].textContent).toContain(
      "Played a key role in scaling the company's engineering organization.",
    );
  });

  it('should handle missing translations', () => {
    component.translationKey.set('missing.key');
    fixture.detectChanges();
    const divs = fixture.nativeElement.querySelectorAll('div');
    expect(divs.length).toBe(0);
  });

  it('should handle nested objects', () => {
    component.translationKey.set('cv.landing.jobs.2');
    fixture.detectChanges();
    const divs = fixture.nativeElement.querySelectorAll('div');
    expect(divs.length).toBe(3);
    expect(divs[0].textContent).toContain('Frontend Manager');
    expect(divs[1].textContent).toContain(
      'BizAway · Full-time · Jul 2023 - Dec 2024 · Vigo, Galicia, Spain · Remote',
    );
  });
});
