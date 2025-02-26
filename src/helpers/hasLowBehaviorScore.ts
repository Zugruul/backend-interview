import assert from 'assert';
import { WithDistance } from './distance';
import { PatientProspect } from '../models/patient.schema';
import { ScoreStats, WithScores } from '../models/score.schema';
import { normalize } from './normalize';

/**
 * @param averageLowBehaviorThreshold 0..* percentage representation an prospect patient must be bellow average in all behavior related scores to be considered a low behavior patient.
 * If the value is 1 it means anything bellow average in all behavior scores will be considered low behavior
 */
export function hasLowBehaviorScore(stats: ScoreStats, averageLowBehaviorThreshold: number) {
	assert(averageLowBehaviorThreshold, 'averageLowBehaviorThreshold must be an an number greater than 0');
	const acceptedOffersAverageScore = normalize({ value: stats.acceptedOffers.avg, ...stats.acceptedOffers });
	const canceledOffersAverageScore = normalize({ value: stats.canceledOffers.avg, ...stats.canceledOffers });
	const averageReplyTimeAverageScore = normalize({ value: stats.averageReplyTime.avg, ...stats.averageReplyTime });

	return function apply(prospect: WithScores<WithDistance<PatientProspect>>) {
		const {
			acceptedOffersScore,
			canceledOffersScore,
			averageReplyTimeScore: replyTimeScore,
		} = prospect.computation.behaviorScore;

		return (
			acceptedOffersScore < acceptedOffersAverageScore * averageLowBehaviorThreshold &&
			canceledOffersScore < canceledOffersAverageScore * averageLowBehaviorThreshold &&
			replyTimeScore < averageReplyTimeAverageScore * averageLowBehaviorThreshold
		);
	};
}
