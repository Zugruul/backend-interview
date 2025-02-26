import { expect } from 'chai';
import { toRadians } from '../toRadians';

describe('toRadians', () => {
	it('converts 0 degrees to 0 radians', () => {
		const result = toRadians(0);
		expect(result).to.equal(0);
	});

	it('converts 90 degrees to π/2 radians', () => {
		const result = toRadians(90);
		expect(result).to.be.closeTo(Math.PI / 2, 0.0001);
	});

	it('converts 180 degrees to π radians', () => {
		const result = toRadians(180);
		expect(result).to.be.closeTo(Math.PI, 0.0001);
	});

	it('converts 270 degrees to 3π/2 radians', () => {
		const result = toRadians(270);
		expect(result).to.be.closeTo((3 * Math.PI) / 2, 0.0001);
	});

	it('converts 360 degrees to 2π radians', () => {
		const result = toRadians(360);
		expect(result).to.be.closeTo(2 * Math.PI, 0.0001);
	});

	it('handles negative degrees', () => {
		const result = toRadians(-90);
		expect(result).to.be.closeTo(-Math.PI / 2, 0.0001);
	});

	it('handles degrees greater than 360', () => {
		const result = toRadians(450);
		expect(result).to.be.closeTo(2.5 * Math.PI, 0.0001);
	});
});
