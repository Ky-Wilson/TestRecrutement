import { Router } from 'express';
import { generateUsersHandler, importUsersHandler } from '../controllers/user.controller';
import { upload } from '../middleware/multer.middleware';

const router = Router();

router.get('/generate', generateUsersHandler);
router.post('/batch', upload.single('file'), importUsersHandler);

export default router;