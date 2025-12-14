import config from 'dotenv';

config.config =  {
    env : process.env.NODE_ENV || 'development',
    databaseURL: process.env.DATABASE_URL || 'postgres://admin:password123@localhost:5432/mydatabase',
    port : process.env.PORT || 3000,   
    jwtSecret : process.env.JWT_SECRET
}