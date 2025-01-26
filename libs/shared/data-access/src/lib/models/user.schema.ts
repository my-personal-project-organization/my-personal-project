import { z } from 'zod';

export const UserSchema = z.object({
  _id: z.string(), // You might want to refine this based on your ID format
  username: z.string(),
  email: z.string().email(),
  password: z.string().optional(), // Consider making this optional or handling it appropriately
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  profilePicture: z.string().url().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type User = z.infer<typeof UserSchema>;
