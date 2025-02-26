import { expect } from 'chai';
import { computeWaitlist } from '../computeWaitlist';
import { PatientProspect } from '../index';

describe('computeWaitlist', () => {
	const facility = { latitude: '40.7128', longitude: '-74.0060' };
	const prospects: PatientProspect[] = [
		{
			id: '1',
			name: 'Evangivaldo 1',
			acceptedOffers: 5,
			canceledOffers: 2,
			averageReplyTime: 30,
			age: 25,
			location: { latitude: '40.73061', longitude: '-73.935242' },
		},
		{
			id: '2',
			name: 'Evangivaldo 2',
			acceptedOffers: 3,
			canceledOffers: 1,
			averageReplyTime: 45,
			age: 30,
			location: { latitude: '40.650002', longitude: '-73.949997' },
		},
		{
			id: '3',
			name: 'Evangivaldo 3',
			acceptedOffers: 8,
			canceledOffers: 0,
			averageReplyTime: 20,
			age: 35,
			location: { latitude: '40.73061', longitude: '-73.935242' },
		},
		{
			id: '4',
			name: 'Evangivaldo 4',
			acceptedOffers: 2,
			canceledOffers: 3,
			averageReplyTime: 50,
			age: 40,
			location: { latitude: '40.73061', longitude: '-73.935242' },
		},
		{
			id: '5',
			name: 'Evangivaldo 5',
			acceptedOffers: 6,
			canceledOffers: 1,
			averageReplyTime: 25,
			age: 45,
			location: { latitude: '40.73061', longitude: '-73.935242' },
		},
		{
			id: '6',
			name: 'Evangivaldo 6',
			acceptedOffers: 4,
			canceledOffers: 2,
			averageReplyTime: 35,
			age: 50,
			location: { latitude: '40.73061', longitude: '-73.935242' },
		},
		{
			id: '7',
			name: 'Evangivaldo 7',
			acceptedOffers: 7,
			canceledOffers: 0,
			averageReplyTime: 15,
			age: 55,
			location: { latitude: '40.73061', longitude: '-73.935242' },
		},
		{
			id: '8',
			name: 'Evangivaldo 8',
			acceptedOffers: 1,
			canceledOffers: 4,
			averageReplyTime: 60,
			age: 60,
			location: { latitude: '40.73061', longitude: '-73.935242' },
		},
		{
			id: '9',
			name: 'Evangivaldo 9',
			acceptedOffers: 9,
			canceledOffers: 0,
			averageReplyTime: 10,
			age: 65,
			location: { latitude: '40.73061', longitude: '-73.935242' },
		},
		{
			id: '10',
			name: 'Evangivaldo 10',
			acceptedOffers: 3,
			canceledOffers: 2,
			averageReplyTime: 40,
			age: 70,
			location: { latitude: '40.73061', longitude: '-73.935242' },
		},
		{
			id: '11',
			name: 'Evangivaldo 11',
			acceptedOffers: 5,
			canceledOffers: 1,
			averageReplyTime: 30,
			age: 75,
			location: { latitude: '40.73061', longitude: '-73.935242' },
		},
		{
			id: '12',
			name: 'Evangivaldo 12',
			acceptedOffers: 2,
			canceledOffers: 3,
			averageReplyTime: 50,
			age: 80,
			location: { latitude: '40.73061', longitude: '-73.935242' },
		},
	];

	it('computes waitlist with default parameters', () => {
		const params = {
			count: 2,
			lowBehaviorCount: 1,
			averageLowBehaviorThreshold: 0.5,
			facility,
			debug: false,
			prospects,
		};

		const result = computeWaitlist(params);
		expect(result).to.have.lengthOf(2);
	});

	it('computes waitlist with debug mode enabled', () => {
		const params = {
			count: 2,
			lowBehaviorCount: 1,
			averageLowBehaviorThreshold: 0.5,
			facility,
			debug: true,
			prospects,
		};

		const result = computeWaitlist(params);
		expect(result).to.have.lengthOf(2);
		expect(result[0]).to.have.property('computation');
	});

	it('computes waitlist with debug mode disabled', () => {
		const params = {
			count: 2,
			lowBehaviorCount: 1,
			averageLowBehaviorThreshold: 0.5,
			facility,
			debug: false,
			prospects,
		};

		const result = computeWaitlist(params);
		expect(result).to.have.lengthOf(2);
		expect(result[0].computation).to.be.undefined;
	});

	it('throws an error if count is less than lowBehaviorCount', () => {
		const params = {
			count: 1,
			lowBehaviorCount: 2,
			averageLowBehaviorThreshold: 0.5,
			facility,
			debug: false,
			prospects,
		};

		expect(() => computeWaitlist(params)).to.throw("Count can't be lower than low behavior count");
	});

	it('filters out low behavior score prospects', () => {
		const params = {
			count: 2,
			lowBehaviorCount: 0,
			averageLowBehaviorThreshold: 0.5,
			facility,
			debug: false,
			prospects,
		};

		const result = computeWaitlist(params);
		expect(result).to.have.lengthOf(2);
		expect(result.every((prospect) => prospect.acceptedOffers > 0)).to.be.true;
	});

	it('shuffles low behavior score prospects', () => {
		const params = {
			count: 3,
			lowBehaviorCount: 2,
			averageLowBehaviorThreshold: 0.5,
			facility,
			debug: false,
			prospects,
		};

		const result = computeWaitlist(params);
		expect(result).to.have.lengthOf(3);
	});
});
