import mongoose from 'mongoose';
import config from '../config/config.js';

async function connectDB(){
    await mongoose.connect(config.Mongo_URI);
    console.log('Database connected');
}
export default connectDB;