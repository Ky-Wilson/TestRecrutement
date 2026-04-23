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

/**
 * @swagger
 * /api/users/generate:
 *   get:
 *     summary: Générer des utilisateurs fictifs
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: count
 *         schema:
 *           type: integer
 *         description: Nombre d'utilisateurs à générer (1-500)
 *     responses:
 *       200:
 *         description: Fichier JSON téléchargé
 */
router.get('/generate', generateUsersHandler);

/**
 * @swagger
 * /api/users/batch:
 *   post:
 *     summary: Importer des utilisateurs via fichier JSON
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Résumé de l'import
 */
router.post('/batch', upload.single('file'), importUsersHandler);

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Récupérer mon profil
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profil de l'utilisateur connecté
 */
router.get('/me', authenticateJWT, getCurrentUserHandler);

/**
 * @swagger
 * /api/users/{username}:
 *   get:
 *     summary: Récupérer un profil utilisateur
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Profil utilisateur
 *       403:
 *         description: Accès refusé
 */
router.get('/:username', authenticateJWT, getUserByUsernameHandler);

export default router;