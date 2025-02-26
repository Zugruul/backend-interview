import { z } from 'zod';
import { WithDistance } from '../helpers/distance';
import { PatientProspect } from './patient.schema';
import { Stats } from './stats.schema';

export const scoreComputationSchema = z.object({
	demographicScore: z.object({
		ageScore: z.number().min(0),
		distanceScore: z.number().min(0),
	}),
	behaviorScore: z.object({
		acceptedOffersScore: z.number().min(0),
		canceledOffersScore: z.number().min(0),
		averageReplyTimeScore: z.number().min(0),
	}),
});

export type ScoreStats = Omit<Record<keyof WithDistance<PatientProspect>, Stats>, 'id' | 'name' | 'location'>;
export type ScoreComputation = z.infer<typeof scoreComputationSchema>;
export type WithScores<T> = T & {
	score: number;
	computation: ScoreComputation;
};
