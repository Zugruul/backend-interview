import { Router } from 'express';
import { getHealth, handleWaitlist } from './controllers';

const router = Router();

router.get('/_health', getHealth);
router.post('/waitlist', handleWaitlist);

export default router;
