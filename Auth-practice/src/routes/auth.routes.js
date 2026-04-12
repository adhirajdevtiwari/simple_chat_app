import userModel from "../models/auth.model.js";
import express from 'express';
import authControllers from '../controllers/auth.controllers.js';

const authRouter=express.Router();

authRouter.post("/register", authControllers.register);
authRouter.get("/get-me",authControllers.getMe);
authRouter.get("/refresh",authControllers.refreshToken);
authRouter.get("/logout",authControllers.logout);
authRouter.get("/logout-all",authControllers.logoutAll);
authRouter.post("/login",authControllers.login);


export default authRouter;