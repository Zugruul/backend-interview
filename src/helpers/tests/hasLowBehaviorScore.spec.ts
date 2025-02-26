import { expect } from 'chai';
import { hasLowBehaviorScore } from '../hasLowBehaviorScore';
import { ScoreStats, WithScores } from '../../models/score.schema';
import { PatientProspect } from '../../models/patient.schema';
import { WithDistance } from '../distance';
import { normalize } from '../normalize';

type PatientProspectWithScores = WithScores<WithDistance<PatientProspect>>;

describe('hasLowBehaviorScore', () => {
	const stats = {
		acceptedOffers: { avg: 50, min: 10, max: 90 },
		canceledOffers: { avg: 30, min: 5, max: 70 },
		averageReplyTime: { avg: 20, min: 1, max: 50 },
	} as ScoreStats;

	it('throws an error if averageLowBehaviorThreshold is not greater than 0', () => {
		expect(() => hasLowBehaviorScore(stats, 0)).to.throw('averageLowBehaviorThreshold must be an an number greater than 0');
	});

	it('returns true for a prospect with low behavior scores', () => {
		const prospect = {
			computation: {
				behaviorScore: {
					acceptedOffersScore: normalize({ value: 49, ...stats.acceptedOffers }),
					canceledOffersScore: normalize({ value: 29, ...stats.canceledOffers }),
					averageReplyTimeScore: normalize({ value: 19, ...stats.averageReplyTime }),
				},
			},
		} as PatientProspectWithScores;

		const isLowBehavior = hasLowBehaviorScore(stats, 1);
		const result = isLowBehavior(prospect);

		expect(result).to.be.true;
	});

	it('returns false for a prospect with average behavior scores', () => {
		const prospect = {
			computation: {
				behaviorScore: {
					acceptedOffersScore: normalize({ value: 50, ...stats.acceptedOffers }),
					canceledOffersScore: normalize({ value: 30, ...stats.canceledOffers }),
					averageReplyTimeScore: normalize({ value: 20, ...stats.averageReplyTime }),
				},
			},
		} as PatientProspectWithScores;

		const isLowBehavior = hasLowBehaviorScore(stats, 1);
		const result = isLowBehavior(prospect);

		expect(result).to.be.false;
	});

	it('returns false for a prospect with high behavior scores', () => {
		const prospect = {
			computation: {
				behaviorScore: {
					acceptedOffersScore: normalize({ value: 90, ...stats.acceptedOffers }),
					canceledOffersScore: normalize({ value: 70, ...stats.canceledOffers }),
					averageReplyTimeScore: normalize({ value: 50, ...stats.averageReplyTime }),
				},
			},
		} as PatientProspectWithScores;

		const isLowBehavior = hasLowBehaviorScore(stats, 1);
		const result = isLowBehavior(prospect);

		expect(result).to.be.false;
	});

	it('returns false for a prospect with mixed behavior scores', () => {
		const prospect = {
			computation: {
				behaviorScore: {
					acceptedOffersScore: normalize({ value: 40, ...stats.acceptedOffers }),
					canceledOffersScore: normalize({ value: 20, ...stats.canceledOffers }),
					averageReplyTimeScore: normalize({ value: 25, ...stats.averageReplyTime }),
				},
			},
		} as PatientProspectWithScores;

		const isLowBehavior = hasLowBehaviorScore(stats, 1);
		const result = isLowBehavior(prospect);

		expect(result).to.be.false;
	});
});
