import { z } from 'zod';

export const addUserSchema = z.object({
    username: z.string().min(3).max(30),
    email: z.string().email(),
    password: z.string().min(6).max(100),
});

export const getUserSchema = z.object({
    username: z.string().min(3).max(30),
});


export const loginUserSchema = z.object({
    username: z.string().min(3).max(30),
    password: z.string().min(6).max(100),
});

export const deleteUserSchema = z.object({
    username: z.string().min(3).max(30),
});
