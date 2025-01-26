import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScriboDataAccessComponent } from './data-access.component';

describe('ScriboDataAccessComponent', () => {
  let component: ScriboDataAccessComponent;
  let fixture: ComponentFixture<ScriboDataAccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScriboDataAccessComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ScriboDataAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
