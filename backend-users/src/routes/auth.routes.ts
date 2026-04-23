// src/routes/auth.routes.ts
import { Router } from 'express';
import { loginHandler } from '../controllers/auth.controller';

const router = Router();

/**
 * @swagger
 * /api/auth:
 *   post:
 *     summary: Connexion utilisateur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token JWT retourné
 *       401:
 *         description: Identifiants invalides
 */
router.post('/', loginHandler);

export default router;