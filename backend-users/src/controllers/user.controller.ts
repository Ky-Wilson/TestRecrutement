// src/controllers/user.controller.ts
import { Request, Response } from 'express';
import { generateUsers } from '../utils/fakerGenerator';

export const generateUsersHandler = async (req: Request, res: Response) => {
  try {
    const count = parseInt(req.query.count as string) || 10;

    if (count < 1 || count > 500) {
      return res.status(400).json({ 
        success: false, 
        message: "Le paramètre count doit être entre 1 et 500" 
      });
    }

    const users = await generateUsers(count);

    // Déclencher le téléchargement automatique du fichier
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=users-generated-${Date.now()}-${count}.json`);
    
    return res.json(users);
    
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ 
      success: false, 
      message: "Erreur lors de la génération des utilisateurs" 
    });
  }
};

// Placeholder pour l'import batch (on va l'implémenter juste après)
export const importUsersHandler = async (req: Request, res: Response) => {
  res.status(501).json({ 
    success: false, 
    message: "Endpoint /api/users/batch en cours d'implémentation" 
  });
};