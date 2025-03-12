import { z } from 'zod';
import { resourceSchema } from './resource';

export enum UserRole {
  User = 'user',
  Admin = 'admin',
}

export const userSchema = resourceSchema.extend({
  username: z.string().nullable().optional(),
  email: z.string().email(),
});

export type UserResource = z.infer<typeof userSchema>;

export const loginSchema = userSchema
  .extend({
    email: z.string().email(),
  })
  .pick({ email: true });

export const UpdateSchema = userSchema.extend({
  username: z.string().nullable().optional(),
  email: z.string().email(),
});

export type LoginCredentials = z.infer<typeof loginSchema>;
export type UpdateCredentials = z.infer<typeof UpdateSchema>;
