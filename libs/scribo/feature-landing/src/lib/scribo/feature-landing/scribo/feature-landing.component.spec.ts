import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScriboFeatureLandingComponent } from './feature-landing.component';

describe('ScriboFeatureLandingComponent', () => {
  let component: ScriboFeatureLandingComponent;
  let fixture: ComponentFixture<ScriboFeatureLandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScriboFeatureLandingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ScriboFeatureLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
