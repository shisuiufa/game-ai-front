import { z } from 'zod';
import { resourceSchema } from './resource';

export enum WsAnswers {
  GAME_START = 0,
  GAME_ERROR = 1,
  GAME_END = 2,
  GAME_READY = 3,
  GAME_USER_JOINED = 4,
  GAME_SEARCH = 5,
  GAME_JOINED = 6,
  GAME_NEW_ANSWER = 7,
}

export const taskSchema = resourceSchema.extend({
  question: z.string(),
  image: z.string(),
});

export const answersSchema = resourceSchema.extend({
  userId: z.number(),
  answer: z.string(),
  hidden: z.boolean().optional(),
});

export type TaskResource = z.infer<typeof taskSchema>;

export type AnswerResource = z.infer<typeof answersSchema>;
