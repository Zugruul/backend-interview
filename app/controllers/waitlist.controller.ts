import type { Request, Response } from 'express';
import {
	computeWaitlist,
} from '../../src';
import { getProspectPatientsList } from '../services/waitlist.service';

export const handleWaitlist = async (req: Request, res: Response) => {
	try {
		const prospects = (await getProspectPatientsList());
		const waitlist = computeWaitlist({ ...req.body, prospects })
		res.json({ status: 'ok', waitlist });
	} catch (error: unknown) {
		res.status(500).send({ status: 'error', error: { ...error as Error } });
	}
};
