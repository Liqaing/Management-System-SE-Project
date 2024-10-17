import Router from 'express';
import { loginUser } from '../controllers/auth.controller.js';

const authRouter = Router();

authRouter.post('/login', loginUser);

export {authRouter}