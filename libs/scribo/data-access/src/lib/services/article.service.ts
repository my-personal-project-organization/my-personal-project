// libs/shared/data-access/src/lib/services/article.service.ts
import { inject, Injectable } from '@angular/core';
import { FirestoneService } from '@mpp/shared/data-access';
import { catchError, from, map, Observable, of } from 'rxjs';
import { z } from 'zod';
import { Article, ArticleSchema, NewArticle } from '../models/article.schema';

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  private readonly firestoneService = inject(FirestoneService);

  getAll(): Observable<{ success: boolean; data?: Article[] }> {
    return this.firestoneService.getAll<Article>('articles').pipe(
      map((articles) => {
        const validatedArticles = articles
          .map((article) => {
            try {
              return ArticleSchema.parse(article);
            } catch (error) {
              if (error instanceof z.ZodError) {
                console.error('Zod validation error:', error.errors);
              } else {
                console.error('Error parsing article:', error);
              }
              return null;
            }
          })
          .filter((article): article is Article => article !== null);

        return { success: true, data: validatedArticles };
      }),
      catchError((error) => {
        console.error('Error fetching articles:', error);
        return of({ success: false });
      }),
    );
  }

  getById(id: string): Observable<{ success: boolean; data?: Article | undefined }> {
    return this.firestoneService.get<Article>('articles', id).pipe(
      map((article) => {
        if (article === undefined) {
          return { success: true, data: undefined }; // Article not found, but not an error
        }
        try {
          const validatedArticle = ArticleSchema.parse(article);
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
    return from(this.firestoneService.add('articles', article)).pipe(
      map(() => ({ success: true })),
      catchError((error) => {
        console.error('Error adding article:', error);
        return of({ success: false });
      }),
    );
  }

  update(article: Article): Observable<{ success: boolean }> {
    return from(this.firestoneService.update('articles', article.id, article)).pipe(
      map(() => ({ success: true })),
      catchError((error) => {
        console.error('Error updating article:', error);
        return of({ success: false });
      }),
    );
  }

  delete(id: string): Observable<{ success: boolean }> {
    return from(this.firestoneService.delete('articles', id)).pipe(
      map(() => ({ success: true })),
      catchError((error) => {
        console.error('Error deleting article:', error);
        return of({ success: false });
      }),
    );
  }
}
