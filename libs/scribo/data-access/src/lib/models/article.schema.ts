// libs/shared/data-access/src/lib/models/article.schema.ts
import { FirestoreSchemaBase } from '@mpp/shared/data-access';
import { z } from 'zod';

const DescriptionItemSchema = z.object({
  type: z.literal('description'),
  value: z.string(),
});

const ImageItemSchema = z.object({
  type: z.literal('image'),
  value: z.string().url(),
  footer: z.string().optional(),
});

const ContentItemSchema = z.union([DescriptionItemSchema, ImageItemSchema]);

const ContentSectionSchema = z.object({
  title: z.string(),
  items: z.array(ContentItemSchema),
});

export const ArticleSchema = FirestoreSchemaBase.extend({
  userId: z.string(),
  mainTitle: z.string(),
  content: z.array(ContentSectionSchema),
});

export type Article = z.infer<typeof ArticleSchema>;
export type NewArticle = Omit<Article, 'id'>;
