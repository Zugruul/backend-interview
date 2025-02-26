import type { Request, Response } from 'express';
import {
	computeWaitlist,
} from '../../src';
import { getWaitlistData } from '../services/waitlist.service';

export const handleWaitlist = async (req: Request, res: Response) => {
	try {
		const prospects = (await getWaitlistData());
		const waitlist = computeWaitlist({ ...req.body, prospects })
		res.json({ status: 'ok', waitlist });
	} catch (error: unknown) {
		res.status(500).send({ status: 'error', error: { ...error as Error } });
	}
};
