import { Router } from 'express';
import type{ Request, Response } from 'express';
import type{z,ZodSchema} from 'zod';
import { registerUser, loginUser, getProfile } from '../controllers/user.controller.js';
import { authMiddleware } from '../middleware/authmiddleware.js';
import { validateRequest } from '../middleware/validate.js';
import { registerUserSchema, loginUserSchema } from '../validators/user.validator.js';

const router = Router();

router.post('/register', validateRequest(registerUserSchema), registerUser);
router.post('/login', validateRequest(loginUserSchema), loginUser);
router.get('/profile', authMiddleware, getProfile);

export default router;
