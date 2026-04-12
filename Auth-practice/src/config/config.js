import dotenv from 'dotenv';
dotenv.config();
if(!process.env.JWT_SECRET){
    throw new Error("JWT_SECRET is not defined");
}
if(!process.env.MongoDB_URI){
    throw new Error("MongoDB_URI is not defined");
}
const config={
    DB_URL:process.env.MongoDB_URI,
    JWT_SECRET:process.env.JWT_SECRET
}
export default config;
