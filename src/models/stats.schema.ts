import { z } from 'zod';

export const statsSchema = z.object({
	min: z.number(),
	max: z.number(),
	avg: z.number(),
});

export type Stats = z.infer<typeof statsSchema>;
