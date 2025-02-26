import { expect } from 'chai';
import { withPatientAppointmentAcceptanceComputedAcceptanceScore } from '../withComputedScore';
import { Coordinates } from '../../models/coordinates.schema';
import { PatientProspect } from '../../models/patient.schema';
import { ScoreStats } from '../../models/score.schema';
import { WithDistance } from '../distance';

describe('withPatientAppointmentAcceptanceComputedAcceptanceScore', () => {
	const facilityCoordinates: Coordinates = { latitude: '40.7128', longitude: '-74.0060' };
	const stats: ScoreStats = {
		age: { min: 21, max: 90, avg: 50 },
		distance: { min: 0, max: 10000, avg: 50 },
		acceptedOffers: { min: 0, max: 100, avg: 50 },
		canceledOffers: { min: 0, max: 100, avg: 50 },
		averageReplyTime: { min: 0, max: 3600, avg: 50 },
	};

	it('computes the correct score for a patient prospect', () => {
		const patientProspect = {
			id: '1',
			location: {
				latitude: '0',
				longitude: '0',
			},
			name: 'Evangivaldo',
			age: 30,
			distance: 10,
			acceptedOffers: 50,
			canceledOffers: 10,
			averageReplyTime: 20,
		} as WithDistance<PatientProspect>;

		const apply = withPatientAppointmentAcceptanceComputedAcceptanceScore(facilityCoordinates, stats);
		const result = apply(patientProspect);

		expect(result.score).to.be.a('number');
		expect(result.computation.demographicScore.ageScore).to.be.a('number');
		expect(result.computation.demographicScore.distanceScore).to.be.a('number');
		expect(result.computation.behaviorScore.acceptedOffersScore).to.be.a('number');
		expect(result.computation.behaviorScore.canceledOffersScore).to.be.a('number');
		expect(result.computation.behaviorScore.averageReplyTimeScore).to.be.a('number');
	});

	it('throws an error if patient prospect schema is invalid', () => {
		const invalidPatientProspect = {
			id: '1',
			location: {
				latitude: '0',
				longitude: '0',
			},
			name: 'Evangivaldo',
			age: 'invalid',
			distance: 10,
			acceptedOffers: 50,
			canceledOffers: 10,
			averageReplyTime: 20,
		} as unknown as WithDistance<PatientProspect>;

		const applyScore = withPatientAppointmentAcceptanceComputedAcceptanceScore(facilityCoordinates, stats);
		expect(() => applyScore(invalidPatientProspect)).to.throw();
	});

	it('throws an error if facility coordinates schema is invalid', () => {
		const invalidFacilityCoordinates = {
			latitude: 'invalid',
			longitude: '-74.0060',
		} as Coordinates;

		const applyScore = withPatientAppointmentAcceptanceComputedAcceptanceScore(invalidFacilityCoordinates, stats);
		const patientProspect = {
			id: '1',
			location: {
				latitude: '0',
				longitude: '0',
			},
			name: 'Evangivaldo',
			age: 30,
			distance: 10,
			acceptedOffers: 50,
			canceledOffers: 10,
			averageReplyTime: 20,
		} as WithDistance<PatientProspect>;

		expect(() => applyScore(patientProspect)).to.throw();
	});
});
