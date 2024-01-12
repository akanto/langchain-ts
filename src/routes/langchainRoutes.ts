import { Router } from 'express';
import * as langchainController from '../controllers/langchainController';

const router: Router = Router();

router.get('/test', langchainController.test);

export default router;