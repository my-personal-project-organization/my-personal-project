import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CvDataAccessComponent } from './data-access.component';

describe('CvDataAccessComponent', () => {
  let component: CvDataAccessComponent;
  let fixture: ComponentFixture<CvDataAccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CvDataAccessComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CvDataAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
