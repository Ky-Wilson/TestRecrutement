// src/routes/user.routes.ts
import { Router } from 'express';
import { generateUsersHandler, importUsersHandler } from '../controllers/user.controller';

const router = Router();

router.get('/generate', generateUsersHandler);
router.post('/batch', importUsersHandler);

export default router;