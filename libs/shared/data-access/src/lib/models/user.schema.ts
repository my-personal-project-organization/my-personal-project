import { z, ZodSchema } from 'zod';
import { FirestoreSchemaBase } from './firestore.schema';

export const UserSchema: ZodSchema = FirestoreSchemaBase.extend({
  username: z.string(),
  email: z.string().email(),
  password: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  profilePicture: z.string().url().optional(),
});

export type User = z.infer<typeof UserSchema>;
export type NewUser = Omit<User, 'id'>;
