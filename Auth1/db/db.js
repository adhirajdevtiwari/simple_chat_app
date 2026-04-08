import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
async function connectDB() {
    await mongoose.connect(process.env.DB_URI);
    console.log('Connected to MongoDB');
}
export default connectDB;
