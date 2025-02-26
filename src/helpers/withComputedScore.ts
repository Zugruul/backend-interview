import { Coordinates, CoordinatesSchema } from '../models/coordinates.schema';
import { PatientProspect, PatientProspectSchema } from '../models/patient.schema';
import { WithDistance } from './distance';
import { ScoreStats, WithScores } from '../models/score.schema';
import { normalize } from './normalize';

export function withPatientAppointmentAcceptanceComputedAcceptanceScore<
	Patient extends WithDistance<PatientProspect>,
	FacilityCoordinates extends Coordinates,
>(facilityCoordinates: FacilityCoordinates, stats: ScoreStats) {
	return function apply(patientProspect: Patient): WithScores<Patient> {
		PatientProspectSchema.parse(patientProspect);
		CoordinatesSchema.parse(facilityCoordinates);

		const ageScore = normalize({ value: patientProspect.age, ...stats.age }) * 0.1;
		const distanceScore = (1 - normalize({ value: patientProspect.distance, ...stats.distance })) * 0.1; // the farther he is from the facility worse the score should be
		const demographicScoreTotal = ageScore + distanceScore;

		const acceptedOffersScore = normalize({ value: patientProspect.acceptedOffers, ...stats.acceptedOffers }) * 0.3;
		const canceledOffersScore = normalize({ value: patientProspect.canceledOffers, ...stats.canceledOffers }) * 0.3;
		const replyTimeScore = normalize({ value: patientProspect.averageReplyTime, ...stats.averageReplyTime }) * 0.2;
		const behaviorScoreTotal = acceptedOffersScore + canceledOffersScore + replyTimeScore;

		const totalScore = (behaviorScoreTotal + demographicScoreTotal) * 10;

		return {
			...patientProspect,
			score: totalScore,
			computation: {
				demographicScore: {
					ageScore,
					distanceScore,
				},
				behaviorScore: {
					acceptedOffersScore,
					canceledOffersScore,
					averageReplyTimeScore: replyTimeScore,
				},
			},
		};
	};
}
