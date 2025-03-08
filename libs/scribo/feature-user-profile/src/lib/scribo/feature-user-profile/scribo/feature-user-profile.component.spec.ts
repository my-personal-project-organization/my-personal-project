import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScriboFeatureUserProfileComponent } from './feature-user-profile.component';

describe('ScriboFeatureUserProfileComponent', () => {
  let component: ScriboFeatureUserProfileComponent;
  let fixture: ComponentFixture<ScriboFeatureUserProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScriboFeatureUserProfileComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ScriboFeatureUserProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
