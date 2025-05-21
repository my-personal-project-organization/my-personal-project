import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgForTranslateDirective } from './ng-for-translate.directive';

@Component({
  standalone: true,
  imports: [NgForTranslateDirective],
  template: `
    <ng-container *ngForTranslate="let item; let i = index; from: translationKey">
      <div id="translation-{{ i }}">{{ item }}</div>
    </ng-container>
  `,
})
class TestHostComponent {
  translationKey: string | undefined;
}

describe('NgForTranslateDirective', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      schemas: [NO_ERRORS_SCHEMA], // To ignore unknown elements in the template if necessary
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should iterate and translate correctly', () => {
    component.translationKey = 'cv.landing.jobs.2.key-points';
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
    component.translationKey = 'missing.key';
    fixture.detectChanges();
    const divs = fixture.nativeElement.querySelectorAll('div');
    expect(divs.length).toBe(0);
  });

  it('should handle nested objects', () => {
    component.translationKey = 'cv.landing.jobs.2';
    fixture.detectChanges();
    const divs = fixture.nativeElement.querySelectorAll('div');
    expect(divs.length).toBe(3);
    expect(divs[0].textContent).toContain('Frontend Manager');
    expect(divs[1].textContent).toContain(
      'BizAway · Full-time · Jul 2023 - Dec 2024 · Vigo, Galicia, Spain · Remote',
    );
  });
});
