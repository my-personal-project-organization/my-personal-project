import { TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { APP_CONFIG } from '../environments/app-config.token';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, RouterModule.forRoot([])],
      providers: [{ provide: APP_CONFIG, useValue: environment }],
    }).compileComponents();
  });

  it(`should have as title My Personal Project`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.titleService.getTitle()).toEqual('My Personal Project');
  });
});
