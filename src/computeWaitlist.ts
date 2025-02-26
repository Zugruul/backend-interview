import { z } from 'zod';
import {
	CoordinatesSchema,
	getStats,
	hasLowBehaviorScore,
	PatientProspect,
	PatientProspectSchema,
	ScoreStats,
	withPatientAppointmentAcceptanceComputedAcceptanceScore,
} from '.';
import { withDistanceTo } from './helpers/distance';

const computeWaitlistParamsSchema = z
	.object({
		count: z.number().int().min(0, { message: 'Result count must be a positive integer' }).default(10),
		lowBehaviorCount: z
			.number()
			.int()
			.min(0, { message: 'Result count of low behavior prospect patients must be a positive integer or zero' })
			.default(1),
		averageLowBehaviorThreshold: z
			.number()
			.min(0, { message: 'Average low behavior threshold must be a non-negative number' }),
		facility: CoordinatesSchema,
		debug: z.boolean().default(false),
		prospects: z.array(PatientProspectSchema).min(1, 'Waitlist computation requires at least one patient prospect'),
	})
	.refine((data) => data.count >= data.lowBehaviorCount, {
		message: "Count can't be lower than low behavior count",
		path: ['count'],
	});

type ComputeWaitlistParameters = z.infer<typeof computeWaitlistParamsSchema>;

export function computeWaitlist(params: ComputeWaitlistParameters & { prospects: PatientProspect[] }) {
	computeWaitlistParamsSchema.parse(params);
	const waitlist = params.prospects.map(withDistanceTo(params.facility));

	const stats: ScoreStats = {
		acceptedOffers: getStats('acceptedOffers', waitlist),
		canceledOffers: getStats('canceledOffers', waitlist),
		averageReplyTime: getStats('averageReplyTime', waitlist),
		age: getStats('age', waitlist),
		distance: getStats('distance', waitlist),
	};

	const scoredWaitlist = waitlist.map(withPatientAppointmentAcceptanceComputedAcceptanceScore(params.facility, stats));

	const rankedWaitlist = scoredWaitlist
		.filter((prospect) => !hasLowBehaviorScore(stats, params.averageLowBehaviorThreshold)(prospect))
		.sort((a, b) => b.score - a.score)
		.slice(0, params.count - params.lowBehaviorCount);

	const lowBehaviorWaitlist = scoredWaitlist
		.filter(hasLowBehaviorScore(stats, params.averageLowBehaviorThreshold))
		.sort(() => Math.random() - 0.5)
		.slice(0, params.lowBehaviorCount);

	return [...lowBehaviorWaitlist, ...rankedWaitlist].map(({ computation, ...prospect }) => ({
		...prospect,
		computation: params.debug ? computation : undefined,
	}));
}
