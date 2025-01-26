// libs/shared/data-access/src/lib/services/article.service.ts
import { inject, Injectable } from '@angular/core';
import { DdbbService } from '@mpp/shared/data-access';
import { catchError, from, map, Observable, of } from 'rxjs';
import { z } from 'zod';
import {
  Article,
  NewArticle,
  SavedArticle,
  SavedArticleSchema,
} from '../models/article.schema';

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  private readonly ddbbService = inject(DdbbService);

  getAll(): Observable<{ success: boolean; data?: SavedArticle[] }> {
    return this.ddbbService.getAll<Article>('articles').pipe(
      map((articles) => {
        const validatedArticles = articles
          .map((article) => {
            try {
              return SavedArticleSchema.parse(article);
            } catch (error) {
              if (error instanceof z.ZodError) {
                console.error('Zod validation error:', error.errors);
              } else {
                console.error('Error parsing article:', error);
              }
              return null;
            }
          })
          .filter((article): article is SavedArticle => article !== null);

        return { success: true, data: validatedArticles };
      }),
      catchError((error) => {
        console.error('Error fetching articles:', error);
        return of({ success: false });
      }),
    );
  }

  getById(
    id: string,
  ): Observable<{ success: boolean; data?: SavedArticle | undefined }> {
    return this.ddbbService.get<Article>('articles', id).pipe(
      map((article) => {
        if (article === undefined) {
          return { success: true, data: undefined }; // Article not found, but not an error
        }
        try {
          const validatedArticle = SavedArticleSchema.parse(article);
          return { success: true, data: validatedArticle };
        } catch (error) {
          if (error instanceof z.ZodError) {
            console.error('Zod validation error:', error.errors);
          } else {
            console.error('Error parsing article:', error);
          }
          return { success: false }; // Parsing error
        }
      }),
      catchError((error) => {
        console.error('Error fetching article by ID:', error);
        return of({ success: false });
      }),
    );
  }

  add(article: NewArticle): Observable<{ success: boolean }> {
    return from(this.ddbbService.add('articles', article)).pipe(
      map(() => ({ success: true })),
      catchError((error) => {
        console.error('Error adding article:', error);
        return of({ success: false });
      }),
    );
  }

  update(article: SavedArticle): Observable<{ success: boolean }> {
    return from(this.ddbbService.update('articles', article._id, article)).pipe(
      map(() => ({ success: true })),
      catchError((error) => {
        console.error('Error updating article:', error);
        return of({ success: false });
      }),
    );
  }

  delete(id: string): Observable<{ success: boolean }> {
    return from(this.ddbbService.delete('articles', id)).pipe(
      map(() => ({ success: true })),
      catchError((error) => {
        console.error('Error deleting article:', error);
        return of({ success: false });
      }),
    );
  }
}
