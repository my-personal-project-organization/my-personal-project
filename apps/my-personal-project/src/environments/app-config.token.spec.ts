import { TestBed, inject } from '@angular/core/testing';
import { APP_CONFIG } from './app-config.token';
import { EnvironmentModel } from './environment.model';

describe('APP_CONFIG', () => {
  const mockAppConfig: EnvironmentModel = {
    apiUrl: 'test',
    production: false,
    apiKey: 'test-api-key',
    authDomain: 'test-auth-domain',
    projectId: 'test-project-id',
    storageBucket: 'test-storage-bucket',
    messagingSenderId: 'test-messaging-sender-id',
    appId: 'test-app-id',
    measurementId: 'test-measurement-id',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: APP_CONFIG, useValue: mockAppConfig }],
    });
  });

  it('should provide APP_CONFIG', inject(
    [APP_CONFIG],
    (appConfig: EnvironmentModel) => {
      expect(appConfig).toBeDefined();
      expect(appConfig).toEqual(mockAppConfig);
    },
  ));

  it('should have all the required properties', inject(
    [APP_CONFIG],
    (appConfig: EnvironmentModel) => {
      expect(appConfig.apiUrl).toBeDefined();
      expect(appConfig.production).toBeDefined();
      expect(appConfig.apiKey).toBeDefined();
      expect(appConfig.authDomain).toBeDefined();
      expect(appConfig.projectId).toBeDefined();
      expect(appConfig.storageBucket).toBeDefined();
      expect(appConfig.messagingSenderId).toBeDefined();
      expect(appConfig.appId).toBeDefined();
      expect(appConfig.measurementId).toBeDefined();
    },
  ));
});
