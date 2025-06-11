import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT || 5555;
export const mongoDBURL = process.env.mongoDBURL;
export const jwtSecret= process.env.jwtSecret;

