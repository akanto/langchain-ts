import { Router } from 'express';
import * as langchainController from '../controllers/langchainController';

const router: Router = Router();

router.get('/seqchain', langchainController.seqchain);

export default router;