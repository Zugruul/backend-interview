import assert from 'assert';

export function normalize({ min, max, value }: { min: number; max: number; value: number }): number {
	assert(typeof value === 'number', 'normalize expects a number value');
	assert(typeof min === 'number', 'normalize expects a number min');
	assert(typeof max === 'number', 'normalize expects a number max');
	assert(value <= max, 'normalize expects to be within max range');
	assert(value >= min, 'normalize expects to be within min range');

	if (max === min) {
		return 0;
	}

	return (value - min) / (max - min);
}
