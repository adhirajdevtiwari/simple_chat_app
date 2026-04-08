import express from 'express';
import { registerUser, getMe,refreshToken } from '../controllers/auth.controller.js';
const authRouter=express.Router();

authRouter.post('/register',registerUser);
// authRouter.post('/login',loginUser);
authRouter.get("/get-me",getMe);
authRouter.get("/refresh",refreshToken);

export default authRouter;
