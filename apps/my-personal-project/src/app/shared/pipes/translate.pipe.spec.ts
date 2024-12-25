/* eslint-disable @typescript-eslint/no-explicit-any */
import { TestBed } from '@angular/core/testing';
import { TranslationService } from '../services/translations/translation.service';
import { TranslatePipe } from './translate.pipe';

describe('TranslatePipe', () => {
  let pipe: TranslatePipe;
  let translationService: TranslationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TranslatePipe, TranslationService],
    });
    pipe = TestBed.inject(TranslatePipe);
    translationService = TestBed.inject(TranslationService);
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should translate a key', () => {
    const key = 'hello';
    const translatedValue = 'Hola';
    const translateSpy = jest
      .spyOn(translationService, 'translate')
      .mockReturnValue(translatedValue);

    const result = pipe.transform(key);

    expect(translateSpy).toHaveBeenCalledWith(key); // Use the spy
    expect(result).toBe(translatedValue);
  });

  it('should handle missing translations', () => {
    const key = 'missing.key';
    const translateSpy = jest
      .spyOn(translationService, 'translate')
      .mockReturnValue(key);

    const result = pipe.transform(key);

    expect(translateSpy).toHaveBeenCalledWith(key);
    expect(result).toBe(key);
  });

  it('should handle empty or null keys', () => {
    const translateSpy = jest.spyOn(translationService, 'translate'); // Spy without mockReturnValue

    let result = pipe.transform('');
    expect(translateSpy).toHaveBeenCalledWith('');
    expect(result).toBe('');

    result = pipe.transform(null as any);
    expect(translateSpy).toHaveBeenCalledWith(null);
    expect(result).toBe('translate key is not string');

    result = pipe.transform(undefined as any);
    expect(translateSpy).toHaveBeenCalledWith(undefined);
    expect(result).toBe('translate key is not string');
  });
});
