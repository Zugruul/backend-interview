import { toRadians } from './toRadians';
import { Coordinates } from '../models/coordinates.schema';

/** Approximation */
const EARTH_RADIUS_KM = 6371;
const { acos, sin, cos } = Math;

/**
 * @see {@link https://community.fabric.microsoft.com/t5/Desktop/How-to-calculate-lat-long-distance/m-p/3455229/highlight/true#M1145425} formula to calculate distance, confirmed through tests and other sources as well
 * @see {@link https://en.wikipedia.org/wiki/Earth_radius} - confirmation of earth approximated radius
 * @description calculate distance between two coordinates. Returns distance in kilometers
 */
export function getDistanceKm<Location extends Coordinates>(locationA: Location, locationB: Location) {
	const latA = toRadians(parseFloat(locationA.latitude));
	const lonA = toRadians(parseFloat(locationA.longitude));

	const latB = toRadians(parseFloat(locationB.latitude));
	const lonB = toRadians(parseFloat(locationB.longitude));

	return acos(sin(latA) * sin(latB) + cos(latA) * cos(latB) * cos(lonB - lonA)) * EARTH_RADIUS_KM;
}

export type WithDistance<T, Key extends string = 'distance'> = T & { [K in Key]: number } & T;

export function withDistanceTo(coordinates: Coordinates) {
	return function apply<T extends { location: Coordinates }>(target: T): WithDistance<T> {
		return {
			...target,
			distance: getDistanceKm(coordinates, target.location),
		};
	};
}
