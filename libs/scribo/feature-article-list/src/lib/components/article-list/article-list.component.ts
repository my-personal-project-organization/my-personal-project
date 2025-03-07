import { Component, inject } from '@angular/core';
import { Article, ArticleService } from '@mpp/scribo/data-access';
import { IconComponent } from '@mpp/shared/ui';

@Component({
  selector: 'ftr-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.scss'],
  standalone: true,
  imports: [IconComponent],
})
export class ArticleListComponent {
  private readonly articleService = inject(ArticleService);

  public testea = this.test();

  // ! IT WORKS
  test() {
    const mockArticle: Article = {
      _id: 'article-id-123',
      userId: 'user-id-456',
      mainTitle: 'My Awesome Article',
      content: [
        {
          title: 'Introduction',
          items: [
            {
              type: 'description',
              value: 'This is the introduction to my awesome article.',
            },
            {
              type: 'image',
              value: 'https://example.com/image1.jpg',
              footer: 'Image 1 Footer',
            },
          ],
        },
        {
          title: 'Main Content',
          items: [
            {
              type: 'description',
              value: 'Here is the main content of the article.',
            },
            { type: 'description', value: 'More content here.' },
            { type: 'image', value: 'https://example.com/image2.png' },
          ],
        },
        {
          title: 'Conclusion',
          items: [{ type: 'description', value: 'This is the conclusion.' }],
        },
      ],
      createdAt: new Date('2023-10-27T10:00:00Z'),
      updatedAt: new Date('2023-10-27T11:00:00Z'),
    };
    // In a component
    // this.articleService.add(mockArticle).subscribe({
    //   next: (response) => {
    //     if (response.success) {
    //       console.log('Article created successfully!');
    //       // Update UI, show success message, etc.
    //     } else {
    //       console.error('Failed to create article.');
    //       // Show an error message
    //     }
    //   },
    //   error: (err) => {
    //     console.error('Unexpected error during create:', err);
    //   },
    // });
    this.articleService.getAll().subscribe({
      next: (response) => {
        if (response.success) {
          console.log('Articles fetched successfully:', response.data);
          // Update UI with fetched articles
        } else {
          console.error('Failed to fetch articles.');
          // Show an error message
        }
      },
      error: (err) => {
        console.error('Unexpected error during fetch:', err);
      },
    });
  }
}
