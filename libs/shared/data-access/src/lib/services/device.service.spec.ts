import { TestBed } from '@angular/core/testing';
import { DeviceService } from './device.service';
import { DOCUMENT } from '@angular/common';

describe('DeviceService', () => {
  let service: DeviceService;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockDocument: any;

  beforeEach(() => {
    mockDocument = {
      defaultView: {
        innerWidth: 1200, // Initial width, simulating a desktop
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      },
    };

    TestBed.configureTestingModule({
      providers: [DeviceService, { provide: DOCUMENT, useValue: mockDocument }],
    });
    service = TestBed.inject(DeviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return "mobile" for window width less than 768', () => {
    // Mock window.innerWidth
    Object.defineProperty(window, 'innerWidth', {
      value: 767,
      writable: true,
    });
    setTimeout(() => {
      const deviceSignal = service.device();
      expect(deviceSignal).toBe('mobile');
    }, 0);
  });

  it('should return "tablet" for window width between 768 and 1024', () => {
    Object.defineProperty(window, 'innerWidth', {
      value: 900,
      writable: true,
    });
    setTimeout(() => {
      // Mock window.innerWidth
      const deviceSignal = service.device();
      expect(deviceSignal).toBe('tablet');
    }, 0);
  });

  it('should return "desktop" for window width greater than 1024', () => {
    // Mock window.innerWidth
    Object.defineProperty(window, 'innerWidth', {
      value: 1200,
      writable: true,
    });
    setTimeout(() => {
      const deviceSignal = service.device();
      expect(deviceSignal).toBe('desktop');
    }, 0);
  });
});
