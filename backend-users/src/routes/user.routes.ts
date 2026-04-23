// src/routes/user.routes.ts
import { Router } from 'express';
import { 
  generateUsersHandler, 
  importUsersHandler,
  getCurrentUserHandler,
  getUserByUsernameHandler 
} from '../controllers/user.controller';
import { upload } from '../middleware/multer.middleware';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();

// Routes publiques
router.get('/generate', generateUsersHandler);
router.post('/batch', upload.single('file'), importUsersHandler);

// Routes protégées
router.get('/me', authenticateJWT, getCurrentUserHandler);
router.get('/:username', authenticateJWT, getUserByUsernameHandler);

export default router;