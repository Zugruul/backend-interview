import { expect } from 'chai';
import { getDistanceKm, withDistanceTo } from '../distance';
import { Coordinates } from '../../models/coordinates.schema';

/**
 * @see {@link https://www.omnicalculator.com/other/latitude-longitude-distance}
 * @see {@link https://www.nhc.noaa.gov/gccalc.shtml}
 * @description Calculators used to validate tests bellow
 * */
describe('getDistance', () => {
	it('returns 0 when the coordinates are the same', () => {
		const location: Coordinates = { latitude: '52.5200', longitude: '13.4050' }; // Berlin

		const distance = getDistanceKm(location, location);
		expect(distance).to.equal(0);
	});

	it('calculates the distance correctly for coordinates on the equator', () => {
		const locationA: Coordinates = { latitude: '0', longitude: '0' };
		const locationB: Coordinates = { latitude: '0', longitude: '90' };

		const distance = getDistanceKm(locationA, locationB);
		expect(distance).to.be.closeTo(10008, 1);
	});

	it('calculates the distance between two coordinates correctly (Samir Pacocha <-> Bernard Mosciski)', () => {
		const locationA: Coordinates = { latitude: '46.7110', longitude: '-63.1150' }; // Samir Pacocha
		const locationB: Coordinates = { latitude: '-81.0341', longitude: '144.9963' }; // Bernard Mosciski

		const distance = getDistanceKm(locationA, locationB);
		expect(distance).to.be.closeTo(16058, 1);
	});

	it('calculates the distance between two coordinates correctly (Samir Pacocha <-> Theo Effertz)', () => {
		const locationA: Coordinates = { latitude: '46.7110', longitude: '-63.1150' }; // Samir Pacocha
		const locationB: Coordinates = { latitude: '-35.5336', longitude: '-25.2795' }; // Theo Effertz

		const distance = getDistanceKm(locationA, locationB);
		expect(distance).to.be.closeTo(9895, 1);
	});

	it('calculates the same distance between two coordinates if they switch places (Theo Effertz <-> Samir Pacocha)', () => {
		const locationA: Coordinates = { latitude: '46.7110', longitude: '-63.1150' }; // Samir Pacocha
		const locationB: Coordinates = { latitude: '-35.5336', longitude: '-25.2795' }; // Theo Effertz

		const distance = getDistanceKm(locationB, locationA);
		expect(distance).to.be.closeTo(9895, 1);
	});
});

describe('withDistanceTo', () => {
	it('adds distance property to the target object', () => {
		const coordinates: Coordinates = { latitude: '52.5200', longitude: '13.4050' }; // Berlin
		const target = { location: { latitude: '48.8566', longitude: '2.3522' } }; // Paris

		const result = withDistanceTo(coordinates)(target);
		expect(result).to.have.property('distance');
		expect(result.distance).to.be.closeTo(878, 1); // Approximate distance in km
	});

	it('adds distance property with 0 when the coordinates are the same', () => {
		const coordinates: Coordinates = { latitude: '52.5200', longitude: '13.4050' }; // Berlin
		const target = { location: { latitude: '52.5200', longitude: '13.4050' } }; // Berlin

		const result = withDistanceTo(coordinates)(target);
		expect(result).to.have.property('distance');
		expect(result.distance).to.equal(0);
	});
});
