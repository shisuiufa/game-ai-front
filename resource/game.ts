import { z } from 'zod';
import { resourceSchema } from './resource';

export enum WsAnswers {
  GAME_START = 1,
  GAME_ERROR = 2,
  GAME_END = 3,
  GAME_READY = 4,
  GAME_USER_JOINED = 5,
  GAME_SEARCH = 6,
  GAME_JOINED = 7,
  GAME_NEW_ANSWER = 8,
  GAME_TYPING = 9,
  GAME_TIMER_EXTENDED = 10,
  GAME_GENERATE_TASK = 11,
  GAME_GENERATE_RESULT = 12,
  GAME_LOBBY_NOT_FOUND = 13,
  WS_READY = 14,
  GAME_KICKED= 3000,
  GAME_ANSWER_ACCEPTED = 15,
  GAME_ANSWER_REJECTED = 16,
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
