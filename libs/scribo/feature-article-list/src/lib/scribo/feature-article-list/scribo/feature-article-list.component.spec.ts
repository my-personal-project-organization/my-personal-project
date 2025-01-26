import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScriboFeatureArticleListComponent } from './feature-article-list.component';

describe('ScriboFeatureArticleListComponent', () => {
  let component: ScriboFeatureArticleListComponent;
  let fixture: ComponentFixture<ScriboFeatureArticleListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScriboFeatureArticleListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ScriboFeatureArticleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
