import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CvFeatureAboutComponent } from './feature-about.component';

describe('CvFeatureAboutComponent', () => {
  let component: CvFeatureAboutComponent;
  let fixture: ComponentFixture<CvFeatureAboutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CvFeatureAboutComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CvFeatureAboutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
