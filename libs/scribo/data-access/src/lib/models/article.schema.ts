// libs/shared/data-access/src/lib/models/article.schema.ts
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

export const ArticleSchema = z.object({
  _id: z.string(),
  userId: z.string(),
  mainTitle: z.string(),
  content: z.array(ContentSectionSchema),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Article = z.infer<typeof ArticleSchema>;
