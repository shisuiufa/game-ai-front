import { z } from 'zod';
import { resourceSchema } from './resource';

export enum UserStatus {
  Search = 'search',
  Ready = 'ready',
  Disconnected = 'disconnected'
}

export const userSchema = resourceSchema.extend({
  username: z.string().nullable().optional(),
  email: z.string().email(),
  points: z.number()
});

export type UserResource = z.infer<typeof userSchema>;

export const wsUserSchema = resourceSchema.extend({
  id: z.number(),
  username: z.string(),
  status: z.string().optional(),
});

export type WsUserResource = z.infer<typeof wsUserSchema>;

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
