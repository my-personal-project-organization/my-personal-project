import { TestBed } from '@angular/core/testing';
import { ToastConfig, ToastService } from './toast.service';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ToastService],
    });
    service = TestBed.inject(ToastService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with an empty toasts signal', () => {
    expect(service.toasts()).toEqual([]);
  });

  describe('show', () => {
    it('should add a new toast config to the signal', () => {
      const config: Omit<ToastConfig, 'id'> = {
        message: 'Test message',
        type: 'info',
        duration: 5,
      };
      service.show(config);
      const toasts = service.toasts();
      expect(toasts.length).toBe(1);
      expect(toasts[0].message).toBe('Test message');
      expect(toasts[0].type).toBe('info');
      expect(toasts[0].duration).toBe(5);
      expect(toasts[0].id).toBeDefined();
    });

    it('should return the generated id', () => {
      const config: Omit<ToastConfig, 'id'> = {
        message: 'Another message',
        type: 'success',
        duration: 3,
      };
      const id = service.show(config);
      expect(id).toBeDefined();
      expect(typeof id).toBe('string');
      expect(service.toasts()[0].id).toBe(id);
    });
  });

  describe('convenience methods', () => {
    it('info() should add an info toast', () => {
      service.info('Info test');
      const toasts = service.toasts();
      expect(toasts.length).toBe(1);
      expect(toasts[0].type).toBe('info');
      expect(toasts[0].message).toBe('Info test');
      expect(toasts[0].duration).toBe(5); // Default duration
    });

    it('success() should add a success toast', () => {
      service.success('Success test', 'Title', 10);
      const toasts = service.toasts();
      expect(toasts.length).toBe(1);
      expect(toasts[0].type).toBe('success');
      expect(toasts[0].message).toBe('Success test');
      expect(toasts[0].title).toBe('Title');
      expect(toasts[0].duration).toBe(10);
    });

    it('warning() should add a warning toast', () => {
      service.warning('Warning test');
      const toasts = service.toasts();
      expect(toasts.length).toBe(1);
      expect(toasts[0].type).toBe('warning');
      expect(toasts[0].message).toBe('Warning test');
    });

    it('error() should add an error toast with default duration 0', () => {
      service.error('Error test');
      const toasts = service.toasts();
      expect(toasts.length).toBe(1);
      expect(toasts[0].type).toBe('error');
      expect(toasts[0].message).toBe('Error test');
      expect(toasts[0].duration).toBe(0); // Default error duration
    });
  });

  describe('remove', () => {
    it('should remove a toast by its id', () => {
      const id1 = service.info('Toast 1');
      const id2 = service.success('Toast 2');
      expect(service.toasts().length).toBe(2);

      service.remove(id1);
      const toasts = service.toasts();
      expect(toasts.length).toBe(1);
      expect(toasts[0].id).toBe(id2);
      expect(toasts[0].message).toBe('Toast 2');
    });

    it('should do nothing if id does not exist', () => {
      service.info('Toast 1');
      service.success('Toast 2');
      const initialToasts = [...service.toasts()]; // Clone array

      service.remove('non-existent-id');
      expect(service.toasts().length).toBe(2);
      expect(service.toasts()).toEqual(initialToasts); // Should be unchanged
    });
  });

  it('should generate unique ids', () => {
    const id1 = service.info('Toast 1');
    const id2 = service.success('Toast 2');
    expect(id1).not.toBe(id2);
  });
});
