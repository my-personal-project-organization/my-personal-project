import { Article } from '../models';

export const mockArticle: Article = {
  id: 'article-id-123',
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

export const mockArticles: Article[] = [
  mockArticle,
  {
    id: 'article-id-456',
    userId: 'user-id-789',
    mainTitle: 'Another Great Article',
    content: [
      {
        title: 'Start Here',
        items: [
          {
            type: 'description',
            value: 'This article is about something else.',
          },
          {
            type: 'image',
            value: 'https://example.com/another-image.gif',
            footer: 'Animated GIF',
          },
        ],
      },
    ],
    createdAt: new Date('2023-10-28T14:00:00Z'),
    updatedAt: new Date('2023-10-28T15:30:00Z'),
  },
];
