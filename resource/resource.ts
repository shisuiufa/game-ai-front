import { z } from 'zod';

const resourceSchema = z.object({
  id: z.number().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

type Resource = z.infer<typeof resourceSchema>;

export { resourceSchema, type Resource };
