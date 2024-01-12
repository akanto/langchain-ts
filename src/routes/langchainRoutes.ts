import { Router } from 'express';
import * as langchainController from '../controllers/langchainController';

const router: Router = Router();

router.get('/simple', langchainController.simple);
router.get('/retrieval', langchainController.retrieval);
router.get('/conversation', langchainController.conversation);

export default router;
