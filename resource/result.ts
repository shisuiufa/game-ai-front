import {resourceSchema} from "~/resource/resource";
import {z} from "zod";
import type {WsUserResource} from "~/resource/user";

export const resultSchema = resourceSchema.extend({
    user: WsUserResource,
    answer: z.string(),
    score: z.number(),
    time: z.number(),
});

export type ResultResource = z.infer<typeof resultSchema>;