import dotenv from 'dotenv';
dotenv.config();

if(!process.env.Mongo_URI){
    throw new Error('Mongo_URI is not defined');
}
if(!process.env.JWT_SECRET){
    throw new Error('JWT_SECRET is not defined');
}
const config={
    Mongo_URI:process.env.Mongo_URI,
    JWT_SECRET:process.env.JWT_SECRET,
}
export default config;