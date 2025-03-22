import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScriboFeatureLayoutComponent } from './feature-layout.component';

describe('ScriboFeatureLayoutComponent', () => {
  let component: ScriboFeatureLayoutComponent;
  let fixture: ComponentFixture<ScriboFeatureLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScriboFeatureLayoutComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ScriboFeatureLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
