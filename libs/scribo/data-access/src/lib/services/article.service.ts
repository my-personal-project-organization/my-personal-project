import { inject, Injectable } from '@angular/core';
import { DdbbService } from '@mpp/shared/data-access';
import { catchError, from, map, Observable, of } from 'rxjs';
import { Article } from '../models';

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  private readonly ddbbService = inject(DdbbService);

  getAll(): Observable<{ success: boolean; data?: Article[] }> {
    return this.ddbbService.getAll<Article>('articles').pipe(
      map((articles) => ({ success: true, data: articles })),
      catchError((error) => {
        console.error('Error fetching articles:', error);
        return of({ success: false });
      }),
    );
  }

  getById(
    id: string,
  ): Observable<{ success: boolean; data?: Article | undefined }> {
    return this.ddbbService.get<Article>('articles', id).pipe(
      map((article) => ({ success: true, data: article })),
      catchError((error) => {
        console.error('Error fetching article by ID:', error);
        return of({ success: false });
      }),
    );
  }

  add(article: Article): Observable<{ success: boolean }> {
    return from(this.ddbbService.add('articles', article)).pipe(
      map(() => ({ success: true })), // Map to success: true on successful add
      catchError((error) => {
        console.error('Error adding article:', error);
        return of({ success: false }); // Return success: false on error
      }),
    );
  }

  update(article: Article): Observable<{ success: boolean }> {
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
