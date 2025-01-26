import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';

setupZoneTestEnv({
  errorOnUnknownElements: true,
  errorOnUnknownProperties: true,
});

import '@angular/localize/init';
global.TextEncoder = TextEncoder;

// ? Import fetch to fix --> ReferenceError: fetch is not defined. Inside ddbb.service.spec.ts
import fetch from 'node-fetch';

(globalThis as any).fetch = fetch;
(globalThis as any).Response = fetch.Response;
(globalThis as any).Headers = fetch.Headers;
(globalThis as any).Request = fetch.Request;
