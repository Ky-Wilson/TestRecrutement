// src/middleware/multer.middleware.ts
import multer from 'multer';

const storage = multer.memoryStorage(); // On garde en mémoire (pas besoin de sauvegarder sur disque)

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // max 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/json') {
      cb(null, true);
    } else {
      cb(new Error('Seuls les fichiers JSON sont acceptés'));
    }
  }
});