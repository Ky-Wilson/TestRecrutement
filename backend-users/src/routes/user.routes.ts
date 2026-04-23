// src/routes/user.routes.ts
import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.send('User routes - à implémenter');
});

export default router;