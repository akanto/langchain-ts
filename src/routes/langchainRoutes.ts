import { Router } from 'express';
import * as langchainController from '../controllers/langchainController';

const router: Router = Router();

router.get('/llmchain', langchainController.llmchain);
router.get('/retrieval', langchainController.retrieval);

export default router;
