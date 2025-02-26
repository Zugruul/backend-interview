import { PatientProspect } from '../models/patient.schema';
import { ScoreStats } from '../models/score.schema';
import { WithDistance } from './distance';
import assert from 'assert';

export function getStats(
	property: keyof ScoreStats,
	prospects: WithDistance<PatientProspect>[],
): { min: number; max: number; avg: number } {
	assert(prospects.length, 'Expected at least one prospect client when getting stats');

	const amount = prospects.map((prospect) => prospect[property]);
	const totalAcceptedOffers = amount.reduce((sum, offers) => sum + offers, 0);

	return {
		min: Math.min(...amount),
		max: Math.max(...amount),
		avg: totalAcceptedOffers / prospects.length,
	};
}
