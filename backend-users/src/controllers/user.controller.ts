import { Request, Response } from 'express';
import prisma from '../config/database';
import { generateUsers } from '../utils/fakerGenerator';
import bcrypt from 'bcryptjs';
import { GeneratedUser } from '../utils/fakerGenerator';

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

// ==================== IMPORT BATCH ====================
export const importUsersHandler = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Aucun fichier fourni" });
    }

    const fileContent = req.file.buffer.toString('utf-8');
    const usersToImport: GeneratedUser[] = JSON.parse(fileContent);

    if (!Array.isArray(usersToImport)) {
      return res.status(400).json({ success: false, message: "Le fichier doit contenir un tableau d'utilisateurs" });
    }

    let successCount = 0;
    let failedCount = 0;
    const errors: string[] = [];

    for (const user of usersToImport) {
      try {
        // Vérifier si email ou username existe déjà
        const existingUser = await prisma.user.findFirst({
          where: {
            OR: [
              { email: user.email },
              { username: user.username }
            ]
          }
        });

        if (existingUser) {
          failedCount++;
          errors.push(`Doublon : ${user.email} ou ${user.username}`);
          continue;
        }

        // Hash du mot de passe
        const hashedPassword = await bcrypt.hash(user.password, 12);

        await prisma.user.create({
          data: {
            firstName: user.firstName,
            lastName: user.lastName,
            birthDate: new Date(user.birthDate),
            city: user.city,
            country: user.country,
            avatar: user.avatar,
            company: user.company,
            jobPosition: user.jobPosition,
            mobile: user.mobile,
            username: user.username,
            email: user.email,
            password: hashedPassword,
            role: user.role,
          }
        });

        successCount++;
      } catch (err: any) {
        failedCount++;
        errors.push(`Erreur pour ${user.email} : ${err.message}`);
      }
    }

    return res.status(200).json({
      success: true,
      message: "Import terminé",
      total: usersToImport.length,
      success: successCount,
      failed: failedCount,
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ 
      success: false, 
      message: "Erreur lors de l'import du fichier" 
    });
  }
};

// ====================== ROUTES PROTÉGÉES ======================

export const getCurrentUserHandler = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Utilisateur non authentifié" });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        username: true,
        role: true,
        avatar: true,
        birthDate: true,
        city: true,
        country: true,
        company: true,
        jobPosition: true,
        mobile: true,
        createdAt: true,
      }
    });

    if (!user) {
      return res.status(404).json({ success: false, message: "Utilisateur non trouvé" });
    }

    return res.json({ success: true, data: user });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};

export const getUserByUsernameHandler = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Authentification requise" });
    }

    const { username } = req.params;

    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        username: true,
        role: true,
        avatar: true,
        birthDate: true,
        city: true,
        country: true,
        company: true,
        jobPosition: true,
        mobile: true,
        createdAt: true,
      }
    });

    if (!user) {
      return res.status(404).json({ success: false, message: "Utilisateur non trouvé" });
    }

    // Règle de sécurité : User normal ne peut voir que son propre profil
    if (req.user.role !== 'ADMIN' && req.user.username !== username) {
      return res.status(403).json({ 
        success: false, 
        message: "Vous n'avez pas le droit de consulter ce profil" 
      });
    }

    return res.json({ success: true, data: user });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};