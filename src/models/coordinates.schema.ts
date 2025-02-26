import { z } from 'zod';

export const CoordinatesSchema = z.object({
	latitude: z.string().refine((value) => !isNaN(parseFloat(value)), {
		message: 'Longitude must be a text representation of a an number',
	}),
	longitude: z.string().refine((value) => !isNaN(parseFloat(value)), {
		message: 'Longitude must be a text representation of a an number',
	}),
});

export type Coordinates = z.infer<typeof CoordinatesSchema>;
