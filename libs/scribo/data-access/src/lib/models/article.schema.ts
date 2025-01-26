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

export const BaseArticleSchema = z.object({
  userId: z.string(),
  mainTitle: z.string(),
  content: z.array(ContentSectionSchema),
});

// Schema for a new article (before saving)
export const NewArticleSchema = BaseArticleSchema.extend({}); // Same as BaseArticleSchema
export type NewArticle = z.infer<typeof NewArticleSchema>;

// Schema for a saved article (with id and timestamps)
export const SavedArticleSchema = BaseArticleSchema.extend({
  _id: z.string(),
  createdAt: z.any(), // Or z.date() if you are always converting on retrieval
  updatedAt: z.any(), // Or z.date() if you are always converting on retrieval
});
export type SavedArticle = z.infer<typeof SavedArticleSchema>;

// Still we use a generic Article type if needed
export type Article = NewArticle | SavedArticle;
