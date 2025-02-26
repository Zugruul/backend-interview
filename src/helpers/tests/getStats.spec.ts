import { expect } from 'chai';
import { getStats } from '../getStats';
import { PatientProspect } from '../../models/patient.schema';
import { WithDistance } from '../distance';

type PatientProspectArray = Array<WithDistance<PatientProspect>>;

describe('getStats', () => {
	it('throws an error when no prospects are provided', () => {
		const prospects: WithDistance<PatientProspect>[] = [];
		expect(() => getStats('acceptedOffers', prospects)).to.throw(
			'Expected at least one prospect client when getting stats',
		);
	});

	it('returns correct stats for a given property', () => {
		const prospects = [{ acceptedOffers: 5 }, { acceptedOffers: 10 }, { acceptedOffers: 15 }] as PatientProspectArray;

		const stats = getStats('acceptedOffers', prospects);
		expect(stats).to.deep.equal({ min: 5, max: 15, avg: 10 });
	});

	it('returns correct stats for another property', () => {
		const prospects: WithDistance<PatientProspect>[] = [
			{ distance: 10, acceptedOffers: 5 },
			{ distance: 20, acceptedOffers: 10 },
			{ distance: 30, acceptedOffers: 15 },
		] as PatientProspectArray;

		const stats = getStats('distance', prospects);
		expect(stats).to.deep.equal({ min: 10, max: 30, avg: 20 });
	});
});
