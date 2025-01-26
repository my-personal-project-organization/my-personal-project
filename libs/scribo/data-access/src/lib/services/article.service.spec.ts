/* eslint-disable @typescript-eslint/no-explicit-any */
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { DdbbService } from '@mpp/shared/data-access';
import { of, throwError } from 'rxjs';
import {
  Article,
  NewArticleSchema,
  SavedArticle,
  SavedArticleSchema,
} from '../models';
import { mockArticle, mockArticles } from './article.mock';
import { ArticleService } from './article.service';

describe('ArticleService', () => {
  let service: ArticleService;
  let mockDdbbService: Partial<DdbbService>;

  beforeEach(() => {
    // Mock the DdbbService
    mockDdbbService = {
      getAll: jest.fn(),
      get: jest.fn(),
      add: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        ArticleService,
        { provide: DdbbService, useValue: mockDdbbService },
      ],
    });

    service = TestBed.inject(ArticleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll', () => {
    it('should return an array of articles on success', fakeAsync(() => {
      (mockDdbbService.getAll as jest.Mock).mockReturnValue(of(mockArticles));

      let result: { success: boolean; data?: Article[] } | undefined;
      service.getAll().subscribe((response) => {
        result = response;
      });

      tick();

      expect(result).toEqual({ success: true, data: mockArticles });
      expect(mockDdbbService.getAll).toHaveBeenCalledWith('articles');
    }));

    it('should handle errors from DdbbService and return success: false', fakeAsync(() => {
      const errorMessage = 'Error fetching articles';
      (mockDdbbService.getAll as jest.Mock).mockReturnValue(
        throwError(() => new Error(errorMessage)),
      );

      let result: { success: boolean; data?: Article[] } | undefined;
      service.getAll().subscribe((response) => {
        result = response;
      });

      tick();

      expect(result).toEqual({ success: false });
      expect(mockDdbbService.getAll).toHaveBeenCalledWith('articles');
    }));

    it('should filter out invalid articles', fakeAsync(() => {
      const invalidArticle = { _id: 'invalid', userId: 'test' }; // Missing required fields
      const articlesWithInvalid = [...mockArticles, invalidArticle];
      (mockDdbbService.getAll as jest.Mock).mockReturnValue(
        of(articlesWithInvalid),
      );

      let result: { success: boolean; data?: Article[] } | undefined;
      service.getAll().subscribe((response) => {
        result = response;
      });

      tick();

      expect(result).toEqual({ success: true, data: mockArticles }); // Should only contain valid articles
      expect(mockDdbbService.getAll).toHaveBeenCalledWith('articles');
    }));
  });

  describe('getById', () => {
    it('should return an article by id on success', fakeAsync(() => {
      (mockDdbbService.get as jest.Mock).mockReturnValue(of(mockArticle));

      let result: { success: boolean; data?: Article | undefined } | undefined;
      service.getById('article-id-123').subscribe((response) => {
        result = response;
      });

      tick();

      expect(result).toEqual({ success: true, data: mockArticle });
      expect(mockDdbbService.get).toHaveBeenCalledWith(
        'articles',
        'article-id-123',
      );
    }));

    it('should return undefined if article is not found', fakeAsync(() => {
      (mockDdbbService.get as jest.Mock).mockReturnValue(of(undefined));

      let result: { success: boolean; data?: Article | undefined } | undefined;
      service.getById('non-existent-id').subscribe((response) => {
        result = response;
      });

      tick();

      expect(result).toEqual({ success: true, data: undefined });
      expect(mockDdbbService.get).toHaveBeenCalledWith(
        'articles',
        'non-existent-id',
      );
    }));

    it('should handle errors from DdbbService and return success: false', fakeAsync(() => {
      const errorMessage = 'Error fetching article';
      (mockDdbbService.get as jest.Mock).mockReturnValue(
        throwError(() => new Error(errorMessage)),
      );

      let result: { success: boolean; data?: Article | undefined } | undefined;
      service.getById('some-id').subscribe((response) => {
        result = response;
      });

      tick();

      expect(result).toEqual({ success: false });
      expect(mockDdbbService.get).toHaveBeenCalledWith('articles', 'some-id');
    }));

    it('should return success: false if article fails Zod validation', fakeAsync(() => {
      const invalidArticle = { _id: 'invalid', userId: 'test' }; // Missing required fields
      (mockDdbbService.get as jest.Mock).mockReturnValue(of(invalidArticle));

      let result: { success: boolean; data?: Article | undefined } | undefined;
      service.getById('invalid-id').subscribe((response) => {
        result = response;
      });

      tick();

      expect(result).toEqual({ success: false });
      expect(mockDdbbService.get).toHaveBeenCalledWith(
        'articles',
        'invalid-id',
      );
    }));
  });

  describe('add', () => {
    it('should add a Zod-validated article and return success: true', fakeAsync(() => {
      const newArticle: Article = NewArticleSchema.parse({
        ...mockArticle,
        _id: 'new-article-id',
      });

      (mockDdbbService.add as jest.Mock).mockReturnValue(Promise.resolve({}));

      let result: { success: boolean } | undefined;
      service.add(newArticle).subscribe((response) => {
        result = response;
      });

      tick();

      expect(result).toEqual({ success: true });
      expect(mockDdbbService.add).toHaveBeenCalledWith('articles', newArticle);
    }));

    it('should handle errors from DdbbService and return success: false', fakeAsync(() => {
      const newArticle: Article = NewArticleSchema.parse({
        ...mockArticle,
        _id: 'new-article-id',
      });
      const errorMessage = 'Error adding article';
      (mockDdbbService.add as jest.Mock).mockReturnValue(
        throwError(() => new Error(errorMessage)),
      );

      let result: { success: boolean } | undefined;
      service.add(newArticle).subscribe((response) => {
        result = response;
      });

      tick();

      expect(result).toEqual({ success: false });
      expect(mockDdbbService.add).toHaveBeenCalledWith('articles', newArticle);
    }));
  });

  describe('update', () => {
    it('should update a Zod-validated article and return success: true', fakeAsync(() => {
      const updatedArticle: SavedArticle = SavedArticleSchema.parse({
        // Use SavedArticleSchema
        ...mockArticle,
        mainTitle: 'Updated Title',
      });

      (mockDdbbService.update as jest.Mock).mockReturnValue(Promise.resolve());

      let result: { success: boolean } | undefined;
      service.update(updatedArticle).subscribe((response) => {
        result = response;
      });

      tick();

      expect(result).toEqual({ success: true });
      expect(mockDdbbService.update).toHaveBeenCalledWith(
        'articles',
        (mockArticle as SavedArticle)._id,
        updatedArticle,
      );
    }));

    it('should handle errors from DdbbService and return success: false', fakeAsync(() => {
      const updatedArticle: SavedArticle = SavedArticleSchema.parse({
        // Use SavedArticleSchema
        ...mockArticle,
        mainTitle: 'Updated Title',
      });
      const errorMessage = 'Error updating article';
      (mockDdbbService.update as jest.Mock).mockReturnValue(
        throwError(() => new Error(errorMessage)),
      );

      let result: { success: boolean } | undefined;
      service.update(updatedArticle).subscribe((response) => {
        result = response;
      });

      tick();

      expect(result).toEqual({ success: false });
      expect(mockDdbbService.update).toHaveBeenCalledWith(
        'articles',
        (mockArticle as SavedArticle)._id,
        updatedArticle,
      );
    }));
  });

  describe('delete', () => {
    it('should delete an article and return success: true', fakeAsync(() => {
      (mockDdbbService.delete as jest.Mock).mockReturnValue(Promise.resolve());

      let result: { success: boolean } | undefined;
      service
        .delete((mockArticle as SavedArticle)._id)
        .subscribe((response) => {
          result = response;
        });

      tick();

      expect(result).toEqual({ success: true });
      expect(mockDdbbService.delete).toHaveBeenCalledWith(
        'articles',
        (mockArticle as SavedArticle)._id,
      );
    }));

    it('should handle errors from DdbbService and return success: false', fakeAsync(() => {
      const errorMessage = 'Error deleting article';
      (mockDdbbService.delete as jest.Mock).mockReturnValue(
        throwError(() => new Error(errorMessage)),
      );

      let result: { success: boolean } | undefined;
      service.delete('some-id').subscribe((response) => {
        result = response;
      });

      tick();

      expect(result).toEqual({ success: false });
      expect(mockDdbbService.delete).toHaveBeenCalledWith(
        'articles',
        'some-id',
      );
    }));
  });
});
