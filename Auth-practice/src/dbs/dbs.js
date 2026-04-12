import mongoose from 'mongoose';
import config from '../config/config.js';

async function connectDB(){
    await mongoose.connect(config.DB_URL);
    console.log("connected to db");
}
export default connectDB;
