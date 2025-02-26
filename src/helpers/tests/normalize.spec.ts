import { expect } from 'chai';
import { normalize } from '../normalize';

describe('normalize', () => {
	it('normalizes a value within the range', () => {
		const result = normalize({ min: 0, max: 10, value: 5 });
		expect(result).to.equal(0.5);
	});

	it('returns 1 if value is equal to max range', () => {
		const result = normalize({ min: 0, max: 10, value: 10 });
		expect(result).to.equal(1);
	});

	it('returns 0 if value is equal to min range', () => {
		const result = normalize({ min: 0, max: 10, value: 0 });
		expect(result).to.equal(0);
	});

	it('returns 0 if min and max are equal', () => {
		const result = normalize({ min: 5, max: 5, value: 5 });
		expect(result).to.equal(0);
	});

	it('throws an error if value is not a number', () => {
		expect(() => normalize({ min: 0, max: 10, value: '5' as unknown as number })).to.throw(
			'normalize expects a number value',
		);
	});

	it('throws an error if min is not a number', () => {
		expect(() => normalize({ min: '0' as unknown as number, max: 10, value: 5 })).to.throw(
			'normalize expects a number min',
		);
	});

	it('throws an error if max is not a number', () => {
		expect(() => normalize({ min: 0, max: '10' as unknown as number, value: 5 })).to.throw(
			'normalize expects a number max',
		);
	});

	it('throws an error if value is greater than max', () => {
		expect(() => normalize({ min: 0, max: 10, value: 15 })).to.throw('normalize expects to be within max range');
	});

	it('throws an error if value is less than min', () => {
		expect(() => normalize({ min: 5, max: 10, value: 0 })).to.throw('normalize expects to be within min range');
	});
});
