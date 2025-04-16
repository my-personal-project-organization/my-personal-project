/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { Auth } from '@angular/fire/auth';
import { AuthService } from './auth.service';

describe('Service: Auth', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: Auth, useValue: {} }, // Mock or provide the Auth service
      ],
    });
  });

  it('should ...', inject([AuthService], (service: AuthService) => {
    expect(service).toBeTruthy();
  }));
});
