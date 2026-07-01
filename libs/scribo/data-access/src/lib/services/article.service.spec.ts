import { TestBed } from '@angular/core/testing';
import { FirestoneService } from '@mpp/shared/data-access';
import { of, throwError, firstValueFrom } from 'rxjs';
import { Article, ArticleSchema, NewArticle } from '../models';
import { mockArticle, mockArticles } from './article.mock';
import { ArticleService } from './article.service';

describe('ArticleService', () => {
  let service: ArticleService;
  let mockFirestoneService: Partial<FirestoneService>;

  beforeEach(() => {
    mockFirestoneService = {
      getAll: jest.fn(),
      get: jest.fn(),
      add: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [ArticleService, { provide: FirestoneService, useValue: mockFirestoneService }],
    });

    service = TestBed.inject(ArticleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll', () => {
    it('should return an array of articles on success', () => {
      (mockFirestoneService.getAll as jest.Mock).mockReturnValue(of(mockArticles));

      let result: { success: boolean; data?: Article[] } | undefined;
      service.getAll().subscribe((response) => {
        result = response;
      });

      expect(result).toEqual({ success: true, data: mockArticles });
      expect(mockFirestoneService.getAll).toHaveBeenCalledWith('articles');
    });

    it('should handle errors from FirestoneService and return success: false', () => {
      const errorMessage = 'Error fetching articles';
      (mockFirestoneService.getAll as jest.Mock).mockReturnValue(
        throwError(() => new Error(errorMessage))
      );

      let result: { success: boolean; data?: Article[] } | undefined;
      service.getAll().subscribe({
        next: (response) => {
          result = response;
        },
        error: () => {
          // Error should be caught by service
        },
      });

      expect(result).toEqual({ success: false });
      expect(mockFirestoneService.getAll).toHaveBeenCalledWith('articles');
    });

    it('should filter out invalid articles', () => {
      const invalidArticle = { id: 'invalid', userId: 'test' };
      const articlesWithInvalid = [...mockArticles, invalidArticle];
      (mockFirestoneService.getAll as jest.Mock).mockReturnValue(of(articlesWithInvalid));

      let result: { success: boolean; data?: Article[] } | undefined;
      service.getAll().subscribe((response) => {
        result = response;
      });

      expect(result).toEqual({ success: true, data: mockArticles });
      expect(mockFirestoneService.getAll).toHaveBeenCalledWith('articles');
    });
  });

  describe('getById', () => {
    it('should return an article by id on success', () => {
      (mockFirestoneService.get as jest.Mock).mockReturnValue(of(mockArticle));

      let result: { success: boolean; data?: Article | undefined } | undefined;
      service.getById('article-id-123').subscribe((response) => {
        result = response;
      });

      expect(result).toEqual({ success: true, data: mockArticle });
      expect(mockFirestoneService.get).toHaveBeenCalledWith('articles', 'article-id-123');
    });

    it('should return undefined if article is not found', () => {
      (mockFirestoneService.get as jest.Mock).mockReturnValue(of(undefined));

      let result: { success: boolean; data?: Article | undefined } | undefined;
      service.getById('non-existent-id').subscribe((response) => {
        result = response;
      });

      expect(result).toEqual({ success: true, data: undefined });
      expect(mockFirestoneService.get).toHaveBeenCalledWith('articles', 'non-existent-id');
    });

    it('should handle errors from FirestoneService and return success: false', () => {
      const errorMessage = 'Error fetching article';
      (mockFirestoneService.get as jest.Mock).mockReturnValue(
        throwError(() => new Error(errorMessage))
      );

      let result: { success: boolean; data?: Article | undefined } | undefined;
      service.getById('some-id').subscribe({
        next: (response) => {
          result = response;
        },
        error: () => {
          // Error should be caught by service
        },
      });

      expect(result).toEqual({ success: false });
      expect(mockFirestoneService.get).toHaveBeenCalledWith('articles', 'some-id');
    });

    it('should return success: false if article fails Zod validation', () => {
      const invalidArticle = { id: 'invalid', userId: 'test' };
      (mockFirestoneService.get as jest.Mock).mockReturnValue(of(invalidArticle));

      let result: { success: boolean; data?: Article | undefined } | undefined;
      service.getById('invalid-id').subscribe((response) => {
        result = response;
      });

      expect(result).toEqual({ success: false });
      expect(mockFirestoneService.get).toHaveBeenCalledWith('articles', 'invalid-id');
    });
  });

  describe('add', () => {
    it('should add a Zod-validated article and return success: true', async () => {
      const newArticle: NewArticle = {
        ...mockArticle,
      };

      (mockFirestoneService.add as jest.Mock).mockReturnValue(Promise.resolve({}));

      const result = await firstValueFrom(service.add(newArticle));

      expect(result).toEqual({ success: true });
      expect(mockFirestoneService.add).toHaveBeenCalledWith('articles', newArticle);
    });

    it('should handle errors from FirestoneService and return success: false', async () => {
      const newArticle: NewArticle = {
        ...mockArticle,
      };
      const errorMessage = 'Error adding article';
      (mockFirestoneService.add as jest.Mock).mockRejectedValue(new Error(errorMessage));

      const result = await firstValueFrom(service.add(newArticle));

      expect(result).toEqual({ success: false });
      expect(mockFirestoneService.add).toHaveBeenCalledWith('articles', newArticle);
    });
  });

  describe('update', () => {
    it('should update a Zod-validated article and return success: true', async () => {
      const updatedArticle: Article = ArticleSchema.parse({
        ...mockArticle,
        mainTitle: 'Updated Title',
      });

      (mockFirestoneService.update as jest.Mock).mockReturnValue(Promise.resolve());

      const result = await firstValueFrom(service.update(updatedArticle));

      expect(result).toEqual({ success: true });
      expect(mockFirestoneService.update).toHaveBeenCalledWith(
        'articles',
        mockArticle.id,
        updatedArticle
      );
    });

    it('should handle errors from FirestoneService and return success: false', async () => {
      const updatedArticle: Article = ArticleSchema.parse({
        ...mockArticle,
        mainTitle: 'Updated Title',
      });
      const errorMessage = 'Error updating article';
      (mockFirestoneService.update as jest.Mock).mockRejectedValue(new Error(errorMessage));

      const result = await firstValueFrom(service.update(updatedArticle));

      expect(result).toEqual({ success: false });
      expect(mockFirestoneService.update).toHaveBeenCalledWith(
        'articles',
        mockArticle.id,
        updatedArticle
      );
    });
  });

  describe('delete', () => {
    it('should delete an article and return success: true', async () => {
      (mockFirestoneService.delete as jest.Mock).mockReturnValue(Promise.resolve());

      const result = await firstValueFrom(service.delete(mockArticle.id));

      expect(result).toEqual({ success: true });
      expect(mockFirestoneService.delete).toHaveBeenCalledWith('articles', mockArticle.id);
    });

    it('should handle errors from FirestoneService and return success: false', async () => {
      const errorMessage = 'Error deleting article';
      (mockFirestoneService.delete as jest.Mock).mockRejectedValue(new Error(errorMessage));

      const result = await firstValueFrom(service.delete('some-id'));

      expect(result).toEqual({ success: false });
      expect(mockFirestoneService.delete).toHaveBeenCalledWith('articles', 'some-id');
    });
  });
});
