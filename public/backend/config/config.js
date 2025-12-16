import dotenv from 'dotenv';


dotenv.config();

const config = {
    env: process.env.NODE_ENV || 'development',
    dbUser: process.env.DB_USER || 'admin',
    dbHost: process.env.DB_HOST || 'localhost',
    dbName: process.env.DB_NAME || 'todoapp',
    dbPassword: process.env.DB_PASSWORD || 'password',
    dbPort: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
    port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
    jwtSecret: process.env.JWT_SECRET || 'secret',
};

export default config;