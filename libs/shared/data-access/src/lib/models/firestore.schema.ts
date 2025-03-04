import { z } from 'zod';

// Base Firestore schema
export const FirestoreSchemaBase = z.object({
  id: z.string(),
  createdAt: z.unknown(),
  updatedAt: z.unknown(),
});

// Entity interface (with index signature)
export interface Entity {
  id: string;
  [key: string]: unknown;
}

// Helper type
export type FirestoreModel<T extends Entity> = T & z.infer<typeof FirestoreSchemaBase>;
