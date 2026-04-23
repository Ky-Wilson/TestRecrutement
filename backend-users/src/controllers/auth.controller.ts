// src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import { authenticateUser } from '../services/auth.service';

export const loginHandler = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: "Username/Email et mot de passe requis" });
    }

    const { accessToken } = await authenticateUser(username, password);

    return res.json({
      success: true,
      accessToken
    });
  } catch (error: any) {
    return res.status(401).json({
      success: false,
      message: error.message || "Informations de connexion invalides"
    });
  }
};