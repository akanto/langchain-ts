import { Router } from 'express';
import * as langchainController from '../controllers/langchainController';

const router: Router = Router();

router.get('/tokenize', langchainController.tokenize);
router.get('/simple', langchainController.simple);
router.get('/retrieval', langchainController.retrieval);
router.get('/conversation', langchainController.conversation);
router.get('/search', langchainController.search);

export default router;
