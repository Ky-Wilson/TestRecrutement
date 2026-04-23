// src/routes/auth.routes.ts
import { Router } from 'express';
import { loginHandler } from '../controllers/auth.controller';

const router = Router();

router.post('/', loginHandler);

export default router;