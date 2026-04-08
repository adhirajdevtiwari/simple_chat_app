import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import authRoutes from './src/routes/auth.routes.js';
const port=3000;
const app=express();
app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());
app.use('/api/auth',authRoutes);




export default app;
