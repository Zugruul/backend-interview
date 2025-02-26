import { z } from 'zod';
import { CoordinatesSchema } from './coordinates.schema';

export const PatientProspectSchema = z.object({
	id: z.string().min(1, 'Patient must have an id'),
	name: z.string().min(1, 'Patient must have an name'),
	location: CoordinatesSchema,
	age: z.number().min(0, "Patient age can't be less than zero years old"),
	acceptedOffers: z.number().min(0, "Patient number of accepted offers can't be lower than zero"),
	canceledOffers: z.number().min(0, "Patient number of canceled offers can't be lower than zero"),
	averageReplyTime: z.number().min(0, "Patient average reply time can't be lower than zero"),
});

export type PatientProspect = z.infer<typeof PatientProspectSchema>;
